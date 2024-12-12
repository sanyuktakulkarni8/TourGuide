const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('./errorHandler');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      passwordConfirm: hashedPassword,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role, // Store the hashed password
    });

    const token = signToken(newUser._id);
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //1.check if email and passwords exist
    if (!email || !password) {
      return next(new AppError('pls provide email and password', 400));
    }

    //2.check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: { msg: 'something went wrong', err: err },
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    //1>getting token and check if its there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token)
    if (!token) {
      return res.status(401).json({
        status: 'failure',
        message: 'log in first',
      });
    }

    //2.verification of the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    //3.if the user exists because the token can we valid after the user changes his pass or mAY BE THE user is deleted
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'failure',
        message: 'user does not exist',
      });
    }

   if ( currentUser.changedPasswordAfter(decoded.iat)){
    return res.status(401).json({
      status: 'failure',
      message: 'user has changed the password',
    });
   }
   req.user=currentUser;
    next();
  } catch (err) {
    res.status(400).json({
      status: 'failure',
      message: 'user needs to login to see all tours',
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'failure',
        message: 'forbidden user',
      });
    }
    next();
  };
};

exports.forgotPassword=async(req,res,next)=>{
  try{
// get user from posted email 
 const user=await User.findOne({email:req.body.email});
 if(!user){
  return res.status(404).json({
    status: 'failure',
    message: 'email does not exist',
  });
 }
//generate a random  token 
const resetToken=user.createPasswordResetToken();
await user.save();


//send it to user's email
next();
  }catch(err){

  }

}

exports.resetPassword=(req,res,next)=>{

}

