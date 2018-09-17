const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('connection successful'))
  .catch(() => console.error('connection failed'));

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Course = mongoose.model('courses', courseSchema);

async function createCourse(name, author, tags, price) {
  try {
    const course = new Course({ name, author, tags, price });
    return await course.save();
  } catch (err) {
    return err.message;
  }
}
