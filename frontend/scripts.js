const API_BASE_URL = "http://localhost:5000/api"; // Adjust to your backend URL

document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display events
    const eventsContainer = document.querySelector(".events");
    if (eventsContainer) {
        fetch(`${API_BASE_URL}/events`)
            .then((response) => response.json())
            .then((events) => {
                eventsContainer.innerHTML = events.map((event) => `
                    <article class="event">
                        <div class="event-content">
                            <div class="event-details">
                                <h3>${event.name}</h3>
                                <p>${event.description || "No description available"}</p>
                                <p>Days: ${event.days.join(", ")}</p>
                                <p>Time: ${event.time || "TBA"}</p>
                                <p>Location: ${event.location || "TBA"}</p>
                                <p>Available Seats: <span id="availableSeats-${event.id}">${event.availableSeats}</span></p>
                                <a href="booking.html?eventId=${event.id}" class="button">Book Tickets</a>
                            </div>
                            <div class="event-image">
                                <img src="./image/${encodeURIComponent(event.name)}.png" alt="${event.name}" />
                            </div>
                        </div>
                    </article>
                `).join("");
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
                eventsContainer.innerHTML = `<p>Error loading events. Please try again later.</p>`;
            });
    }

    // Fetch and pre-fill booking details
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("eventId");
    if (eventId) {
        fetch(`${API_BASE_URL}/events/${eventId}`)
            .then((response) => response.json())
            .then((event) => {
                document.getElementById("eventName").value = event.name;
                document.getElementById("availableSeats").textContent = `Available Seats: ${event.availableSeats}`;
            })
            .catch((error) => {
                console.error("Error fetching event details:", error);
                alert("Error loading event details. Please try again later.");
            });
    }

    // Handle ticket booking
    const ticketForm = document.getElementById("ticketBookingForm");
    if (ticketForm) {
        ticketForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // Validate eventId
            if (!eventId) {
                alert("Error: No event selected for booking.");
                return;
            }

            const formData = new FormData(ticketForm);
            const ticketData = {
                eventId,
                userId: formData.get("userId"),
                seatNumber: formData.get("seatNumber"),
            };

            fetch(`${API_BASE_URL}/tickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ticketData),
            })
                .then((response) => {
                    if (response.ok) {
                        // Reduce available seats on frontend
                        const availableSeatsElement = document.getElementById(`availableSeats-${eventId}`);
                        if (availableSeatsElement) {
                            let availableSeats = parseInt(availableSeatsElement.textContent);
                            availableSeatsElement.textContent = availableSeats - 1;

                            // Update available seats in the backend
                            fetch(`${API_BASE_URL}/events/${eventId}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ availableSeats: availableSeats - 1 }),
                            }).catch((error) => {
                                console.error("Error updating available seats:", error);
                            });
                        }

                        alert("Booking successful!");
                        ticketForm.reset();
                        window.location.href = "events.html"; // Redirect to event list
                    } else {
                        return response.json().then((error) => {
                            console.error("Backend error:", error);
                            alert(`Booking failed: ${error.message || "Unknown error"}`);
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error booking ticket:", error);
                    alert("Failed to book ticket. Please try again later.");
                });
        });
    }
});
