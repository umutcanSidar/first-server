import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: [true, 'The Username must have'],
  },
  email: {
    type: String,
    required: [true, 'The Email must have'],
  },
  password: {
    type: String,
    min: [8, 'The Password must 8 character'],
    required: [true, 'The Email must have'],
  },
  roleID: {
    type: String,
    default: 'basic',
    enum: ['basic', 'superuser', 'admin'],
  },
  accessToken: {
    type: String,
  },
  created_date: {
    type: Date,
  },
  last_login: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model('Users', UserSchema);
