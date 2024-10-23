const Attendance = require('../models/attendanceModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// 1. Ghi nhận điểm danh hoặc cập nhật điểm danh nếu đã có
exports.takeOrUpdateAttendance = catchAsync(async (req, res, next) => {
    const { date, attendanceList } = req.body;
    const classId = req.params.classId;

    // Kiểm tra xem tất cả các trường cần thiết đã có trong body request chưa
    if (
        !date ||
        !attendanceList ||
        !Array.isArray(attendanceList) ||
        attendanceList.length === 0
    ) {
        return next(new AppError('Missing required fields: date and attendanceList', 400));
    }

    // Định dạng lại date
    const formattedDate = new Date(date);

    // Tìm kiếm dữ liệu điểm danh hiện tại
    const attendanceData = await Attendance.findOne({ class: classId, date: formattedDate });

    if (attendanceData) {
        // Nếu dữ liệu điểm danh đã tồn tại, cập nhật nó
        attendanceData.student_attendance = attendanceList.map((student) => ({
            student_id: student.studentId,
            status: student.status,
        }));

        // Cập nhật thông tin giáo viên
        attendanceData.teacher_attendance = {
            teacher_id: req.user.id,
            status: 'present', // Có thể thay đổi nếu cần
        };

        await attendanceData.save(); // Lưu thay đổi
    } else {
        // Nếu chưa có dữ liệu điểm danh, tạo mới
        const attendance = await Attendance.create({
            class: classId,
            date: formattedDate,
            teacher_attendance: {
                teacher_id: req.user.id,
                status: 'present', // Có thể thay đổi nếu cần
            },
            student_attendance: attendanceList.map((student) => ({
                student_id: student.studentId,
                status: student.status,
            })),
        });
    }

    res.status(200).json({
        status: 'success',
        message: attendanceData ? 'Attendance updated successfully' : 'Attendance created successfully',
        data: {
            attendance: attendanceData || attendance,
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
