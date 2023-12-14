import mongoose from 'mongoose';

const SurveySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dateExpire: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE','EXPIRED'],
    default: 'ACTIVE',
  },
});


const Survey = mongoose.model('Survey', SurveySchema);

export default Survey;