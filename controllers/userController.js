const User=require('../models/userModel');
const APIfeatures =require('../utils/apiFeatures')

exports.getAllUsers =async (req, res) => {

  try {
   

    //execute query
    const features = new APIfeatures(User.find(), req.query)
      .filter()
      .sorting()
      .limit()
      .paging();

    const users = await features.query;

    res.status(200).json({
      status: 'success',
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err,
    });
  }
};


exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not implemented yet',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not implemented yet',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not implemented yet',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not implemented yet',
  });
};
