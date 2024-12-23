const fs = require('fs');
const path = require('path');

// Path to the JSON file
const eventsFilePath = path.join(__dirname, '../data/events.json');

// Helper function to load events from the JSON file
const loadEvents = () => {
  try {
    const data = fs.readFileSync(eventsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading events file:', error);
    return [];
  }
};

// Helper function to save events to the JSON file
const saveEvents = (events) => {
  try {
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to events file:', error);
  }
};

// Fetch all events
const getEvents = (req, res) => {
  const events = loadEvents();
  res.json(events);
};

// Fetch a single event by ID
const getEventById = (req, res) => {
  const { id } = req.params;
  const events = loadEvents();
  const event = events.find((event) => event.id === parseInt(id, 10));

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  res.json(event);
};

// Create a new event
const createEvent = (req, res) => {
  const { name, time, description, location, days, totalSeats } = req.body;

  if (!name || !time || !description || !location || !days || !totalSeats) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const events = loadEvents();
  const newEvent = {
    id: events.length ? events[events.length - 1].id + 1 : 1,
    name,
    time,
    description,
    location,
    days,
    totalSeats,
    availableSeats: totalSeats,
  };

  events.push(newEvent);
  saveEvents(events);
  res.status(201).json(newEvent);
};

// Update an existing event
const updateEvent = (req, res) => {
  const { id } = req.params;
  const { name, time, description, location, days, totalSeats, availableSeats } = req.body;

  const events = loadEvents();
  const eventIndex = events.findIndex((event) => event.id === parseInt(id, 10));

  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Update event details
  events[eventIndex] = {
    ...events[eventIndex],
    name: name || events[eventIndex].name,
    time: time || events[eventIndex].time,
    description: description || events[eventIndex].description,
    location: location || events[eventIndex].location,
    days: days || events[eventIndex].days,
    totalSeats: totalSeats || events[eventIndex].totalSeats,
    availableSeats: availableSeats || events[eventIndex].availableSeats,
  };

  saveEvents(events);
  res.json(events[eventIndex]);
};

// Delete an event
const deleteEvent = (req, res) => {
  const { id } = req.params;
  const events = loadEvents();
  const updatedEvents = events.filter((event) => event.id !== parseInt(id, 10));

  if (events.length === updatedEvents.length) {
    return res.status(404).json({ message: 'Event not found' });
  }

  saveEvents(updatedEvents);
  res.json({ message: 'Event deleted successfully' });
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
