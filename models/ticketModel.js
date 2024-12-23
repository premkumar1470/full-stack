const fs = require('fs');
const path = require('path');
const ticketsFilePath = path.join(__dirname, '../data/tickets.json');

// Helper function to read JSON file
const readJSONFile = () => {
  const data = fs.readFileSync(ticketsFilePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write to JSON file
const writeJSONFile = (data) => {
  fs.writeFileSync(ticketsFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Ticket CRUD functions
const getTickets = () => {
  return readJSONFile();
};

const createTicket = (ticket) => {
  const tickets = readJSONFile();
  tickets.push(ticket);
  writeJSONFile(tickets);
};

const deleteTicket = (id) => {
  const tickets = readJSONFile();
  const index = tickets.findIndex((ticket) => ticket.id === id);
  if (index === -1) return null;
  const deletedTicket = tickets.splice(index, 1);
  writeJSONFile(tickets);
  return deletedTicket[0];
};

module.exports = { getTickets, createTicket, deleteTicket };
