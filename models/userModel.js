const mongoose = require('mongoose');
const brcypt = require('bcrypt');
// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    trim: true,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  this.password = await brcypt.hash(this.password, 12);

  next();
});


userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

// candidatePassword === password provided in login time
// userPassword === encrypted password stored in DB

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await brcypt.compare(candidatePassword, userPassword);
};



const User = mongoose.model('User', userSchema);

module.exports = User;
