const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Teacher = require('../../models/teacherModel');
const Student = require('../../models/studentModel');
const Admin = require('../../models/adminModel');
const Class = require('../../models/classModel');
const Attendance = require('../../models/attendanceModel');
const Fee = require('../../models/feeModel');
const Salary = require('../../models/salaryModel');
const User = require('../../models/userModel');
const Notification = require('../../models/notificationModel');

dotenv.config({ path: '../../.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILE
const users = JSON.parse(fs.readFileSync(`${__dirname}/user.json`, 'utf-8'));
const admins = JSON.parse(fs.readFileSync(`${__dirname}/admin.json`, 'utf-8'));
const students = JSON.parse(
  fs.readFileSync(`${__dirname}/student.json`, 'utf-8'),
);
const teachers = JSON.parse(
  fs.readFileSync(`${__dirname}/teacher.json`, 'utf-8'),
);
const classes = JSON.parse(fs.readFileSync(`${__dirname}/class.json`, 'utf-8'));
const attendances = JSON.parse(
  fs.readFileSync(`${__dirname}/attendance.json`, 'utf-8'),
);

const salaries = JSON.parse(
  fs.readFileSync(`${__dirname}/salary.json`, 'utf8'),
);
const fees = JSON.parse(fs.readFileSync(`${__dirname}/fee.json`, 'utf8'));
const notifications = JSON.parse(
  fs.readFileSync(`${__dirname}/notification.json`, 'utf-8'),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Attendance.create(attendances, { validateBeforeSave: false });
    await Fee.create(fees, { validateBeforeSave: false });
    await Admin.create(admins, { validateBeforeSave: false });
    await Class.create(classes, { validateBeforeSave: false });
    await Salary.create(salaries, { validateBeforeSave: false });
    await Teacher.create(teachers, { validateBeforeSave: false });
    await Student.create(students, { validateBeforeSave: false });
    await Notification.create(notifications, { validateBeforeSave: false });
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Teacher.deleteMany();
    await Admin.deleteMany();
    await Student.deleteMany();
    await Class.deleteMany();
    await Salary.deleteMany();
    await Attendance.deleteMany();
    await Fee.deleteMany();
    await User.deleteMany();
    await Notification.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
