const express = require('express');
const studentController = require('../controllers/studentController');
const router = express.Router();

// Get a student by ID
router.get('/:id', studentController.getStudentProfile);

// Update a student by ID
router.put('/:id', studentController.updateStudent);

// Route to get the student attendance report
router.get('/:id', studentController.getStudentAttendanceReport);

module.exports = router;
