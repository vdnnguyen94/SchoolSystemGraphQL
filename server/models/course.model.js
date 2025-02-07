import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  section: {
    type: Number,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
});
// Ensure unique combination of courseCode, section, and semester
courseSchema.index({ courseCode: 1, section: 1, semester: 1 }, { unique: true });

const Course = mongoose.model('Course', courseSchema);

export default Course;