const express = require('express');
const { getTickets, createTicket, deleteTicket } = require('../controllers/ticketController');

const router = express.Router();

router.get('/', getTickets);
router.get('/:id', getTickets);
router.post('/', createTicket);
router.delete('/:id', deleteTicket);

module.exports = router;
