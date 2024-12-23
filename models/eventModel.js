const fs = require('fs');
const path = require('path');
const eventsFilePath = path.join(__dirname, '../data/events.json');

// Helper function to read JSON file
const readJSONFile = () => {
  const data = fs.readFileSync(eventsFilePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write to JSON file
const writeJSONFile = (data) => {
  fs.writeFileSync(eventsFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Event CRUD functions
const getEvents = () => {
  return readJSONFile();
};

const createEvent = (event) => {
  const events = readJSONFile();
  events.push(event);
  writeJSONFile(events);
};

const updateEvent = (id, updatedEvent) => {
  const events = readJSONFile();
  const index = events.findIndex((event) => event.id === id);
  if (index === -1) return null;
  events[index] = { ...events[index], ...updatedEvent };
  writeJSONFile(events);
  return events[index];
};

const deleteEvent = (id) => {
  const events = readJSONFile();
  const index = events.findIndex((event) => event.id === id);
  if (index === -1) return null;
  const deletedEvent = events.splice(index, 1);
  writeJSONFile(events);
  return deletedEvent[0];
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
