const express = require('express');
const studentController = require('../controllers/studentController');
const router = express.Router();
const multer = require('multer');

// Get a student by ID
router.get('/:id', studentController.getStudentDetails);

// Update a student by ID
router.put('/:id', studentController.updateStudent);

// Route to get the student attendance report
router.get('/:id', studentController.getStudentAttendanceReport);
router.get('/attendance/:id', studentController.getAttendanceById);

//const upload = multer({ dest: 'uploads/' });

router.put('/upload/:id', studentController.uploadAvatar);

// Route to get the student center and class
router.get('/centers/:id', studentController.getCenterById);
router.get('/classes/:id', studentController.getClassById);

module.exports = router;
