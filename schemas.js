const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('connection successful'))
  .catch(() => console.error('connection failed'));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  category: {
    type: String,
    required: true,
    enum: ['backend', 'frontend', 'programming'],
    lowercase: true
  },
  author: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25
  },
  tags: {
    type: Array,
    validate: {
      validator: function(v) {
        console.log(v);
        return v && v.length > 0;
      },
      message: 'tags must be an array and have a length greater than 0'
    }
  },
  price: {
    type: Number,
    required: true,
    min: 5,
    max: 20
  },
  rating: {
    type: Number,
    required: true,
    validate: {
      isAsync: true,
      validator: function(rating, callback) {
        setTimeout(() => {
          const result = 0 <= rating && rating <= 5;
          callback(result);
        }, 2000);
      },
      message: 'Path `rating` should be in between 0 and 5'
    }
  }
});

const Course = mongoose.model('courses', courseSchema);

async function createCourse(data) {
  const course = new Course({ ...data });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for (let err in ex.errors) {
      console.log(ex.errors[err].message);
    }
  }
}

const courseData = {
  name: 'Angular Master',
  author: 'Brooks Benson',
  category: 'Frontend',
  tags: 'programming',
  price: 10,
  rating: 5
};

createCourse(courseData);
