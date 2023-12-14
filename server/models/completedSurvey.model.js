import mongoose from 'mongoose';

const CompletedSurveySchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const CompletedSurvey = mongoose.model('CompletedSurvey', CompletedSurveySchema);

export default CompletedSurvey;
