const { Schema, model } = require('mongoose');

const Todo = new Schema({
  deadline: { type: String },
  title: { type: String },
  description: { type: String },
});

module.exports = model('Todo', Todo);
