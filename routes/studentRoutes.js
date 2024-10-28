const express = require('express');
const studentController = require('../controllers/studentController');
const router = express.Router();

// Route để lấy thông tin chi tiết của một sinh viên
router.get('/:id', studentController.getStudentsDetails);

module.exports = router;
