const express = require('express');
const studentController = require('../controllers/studentController');
const router = express.Router();

// Get a student by ID
router.get('/:id', studentController.getStudentDetails);

module.exports = router;
