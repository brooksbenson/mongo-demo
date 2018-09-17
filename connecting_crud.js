const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('connection successful'))
  .catch(err => console.error('connection failed', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

// creating

async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    author: 'Mosh',
    tags: ['angular', 'frontend'],
    isPublished: true
  });
  const result = await course.save();
}

// reading

/*
  Query API
    .find: queries collection based on filter object
    .limit: limits amount of returned docs
    .sort: sorts docs by a provided prop
    .select: defines shape of returned docs
    .or: logical or, receives two filter objects
    .and: logical and, receives two filter objects
    .count: returns count of docs that match query

  Comparison Operators
    $lt: less than
    $lte: less than or equal
    $et: equal to
    $ne: not equal oto
    $in: value in array
    $nin: value not in array
  
  Regular Expressions
    Used to match patterns in strings
*/

async function readCourses() {
  const pageNumber = 1;
  const pageSize = 10;
  const filter1 = { name: 'Angular Course' };
  const filter2 = { name: 'Node.js Course' };
  const filter3 = { name: /\./ };
  const doubleFilter = [filter1, filter2];
  const courses = await Course.find(filter3)
    .limit(pageSize)
    .skip((pageNumber - 1) * pageSize)
    .sort({ name: 1 })
    .count();
  console.log(courses);
}

// updating

async function updateByQuery(id, update) {
  const course = await Course.findById(id);
  if (!course) return;
  course.set({ ...update });
  const result = await course.save();
  console.log(result);
}

updateByQuery('5b9bfb0d246d1a3938269f49', { name: 'React' });

async function updateInDb(id, update) {
  const result = await Course.findByIdAndUpdate(
    id,
    {
      $set: { ...update }
    },
    { new: true }
  );
  console.log(result);
}

updateInDb('5b9bfb0d246d1a3938269f49', { isPublished: true });

// deleting

async function removeCourse(id) {
  const result = await Course.findByIdAndRemove(id);
  console.log(result);
}

removeCourse('5b9bfb0d246d1a3938269f49');
