const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAdmin = factory.getOne(Admin);
exports.deleteAdmin = factory.deleteOne(Admin);

const paginate = (array, page_size, page_number) => {
  const start = (page_number - 1) * page_size;
  const end = start + page_size;
  return array.slice(start, end);
};

exports.getAdmins = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, active = 'all' } = req.query;
  const allAdmins = await Admin.find().populate('user').populate('centers');
  let filterAdmins;
  switch (active) {
    case 'true':
      filterAdmins = allAdmins.filter((admin) => admin.user[0].active === true);
      break;
    case 'false':
      filterAdmins = allAdmins.filter(
        (admin) => admin.user[0].active === false,
      );
      break;
    default:
      filterAdmins = allAdmins;
  }
  const admins = paginate(filterAdmins, +limit, +page);
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: filterAdmins.length,
    data: {
      data: admins,
    },
  });
});

exports.createAdmin = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: 'admin',
  });

  if (!newUser) return;
  const newAdmin = await Admin.create({
    name: req.body.name,
    centers: req.body.center,
    phone: req.body.phone,
    gender: req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
  });
  await User.findByIdAndUpdate(newUser._id, { role_id: newAdmin._id });

  res.status(200).json({
    status: 'success',
    data: {
      data: newUser,
    },
  });
});

exports.updateAdmin = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.body.userId,
    {
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updateUser) return;
  await Admin.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    centers: req.body.center,
    phone: req.body.phone,
    gender: req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
  });

  res.status(200).json({
    status: 'success',
    message: 'Update successful',
  });
});

exports.disableAdmin = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.enableAdmin = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: true });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
