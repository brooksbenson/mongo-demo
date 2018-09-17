const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/courses')
  .then(() => console.log('Connection successful'))
  .catch(() => console.error('Connection failed'));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

const Course = mongoose.model('courses', courseSchema);

async function getBackendCourses() {
  return await Course.find({
    isPublished: true,
    tags: 'backend'
  })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });
}

async function getCourses() {
  return await Course.find({ isPublished: true, tags: /(frontend|backend)/i })
    .sort('-price')
    .select('name author price');
}

async function fifteenOrMore() {
  return await Course.find({ isPublished: true })
    .or([
      {
        price: { $gte: 15 }
      },
      {
        name: /by/i
      }
    ])
    .sort('-price')
    .select('name price');
}

async function run(operation) {
  const result = await operation();
  console.log(result);
}

run(fifteenOrMore);
