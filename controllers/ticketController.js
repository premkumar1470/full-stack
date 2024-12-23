const ticketModel = require('../models/ticketModel');

const getTickets = (req, res) => {
  const tickets = ticketModel.getTickets();
  res.json(tickets);
};

const createTicket = (req, res) => {
  const ticket = req.body;
  ticketModel.createTicket(ticket);
  res.status(201).json(ticket);
};

const deleteTicket = (req, res) => {
  const { id } = req.params;
  const deletedTicket = ticketModel.deleteTicket(id);
  if (!deletedTicket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  res.json(deletedTicket);
};

module.exports = { getTickets, createTicket, deleteTicket };
