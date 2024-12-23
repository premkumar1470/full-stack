const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent, getEventById} = require('../controllers/eventController');

const router = express.Router();

router.get('/', getEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/:id', getEventById); // Route to get a single event

module.exports = router;
