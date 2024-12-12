const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a name is required'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // validate:{
    //     validator:function(email){
    //         return ;
    //     }
    // }
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    console.log(this.passwordChangedAt, JWTTimestamp);

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
