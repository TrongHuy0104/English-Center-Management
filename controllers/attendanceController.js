const Attendance = require('../models/attendanceModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// 1. Ghi nhận điểm danh hoặc cập nhật điểm danh nếu đã có
exports.takeAttendance = catchAsync(async (req, res, next) => {
    const { attendanceList } = req.body; // Lấy danh sách điểm danh từ body
    const classId = req.params.classId;
    const date = req.params.date; // Lấy ngày từ params

    // Kiểm tra xem tất cả các trường cần thiết đã có trong body request chưa
    if (!attendanceList || !Array.isArray(attendanceList) || attendanceList.length === 0) {
        return next(new AppError('Missing required fields: attendanceList', 400));
    }

    // Định dạng lại date
    const formattedDate = new Date(date);

    // Tìm bản ghi điểm danh đã tồn tại
    let attendance = await Attendance.findOne({ class: classId, date: formattedDate });

    const teacherId = req.user.id; // Giả sử bạn có ID giáo viên từ auth middleware
    const teacherStatus = attendance ? attendance.teacher_attendance.status : 'absent';

    // Nếu bản ghi điểm danh đã tồn tại
    if (attendance) {
        // Nếu teacher_status là absent, cập nhật sang present
        if (teacherStatus === 'absent') {
            attendance.teacher_attendance.status = 'present';
        }

        // Cập nhật danh sách sinh viên
        attendance.student_attendance = attendanceList.map(student => ({
            student_id: student.studentId,
            status: student.status,
        }));
    } else {
        // Nếu không tồn tại, tạo mới bản ghi điểm danh
        attendance = await Attendance.create({
            class: classId,
            date: formattedDate,
            teacher_attendance: {
                teacher_id: teacherId,
                status: 'present', // Mặc định là present nếu mới tạo
            },
            student_attendance: attendanceList.map(student => ({
                student_id: student.studentId,
                status: student.status,
            })),
        });
    }

    // Lưu bản ghi điểm danh
    await attendance.save();

    res.status(201).json({
        status: 'success',
        data: {
            attendance,
        },
    });
});

// 2. Lấy dữ liệu điểm danh
exports.getAttendanceData = catchAsync(async (req, res, next) => {
    const classId = req.params.classId;
    const date = req.params.date;

    // Kiểm tra xem classId và date có được cung cấp không
    if (!classId || !date) {
        return next(new AppError('Class ID and date must be provided', 400));
    }

    // Định dạng lại date
    const formattedDate = new Date(date);

    const attendanceData = await Attendance.findOne({
        class: classId,
        date: formattedDate,
    });

    if (!attendanceData) {
        return next(new AppError('No attendance data found for this class on this date', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            attendance: attendanceData,
        },
    });
});
