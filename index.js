const express = require('express')
const app = express()
app.use(express.json())

const connectDB = require('./config/db')
const Student = require('./models/Student');

connectDB();

app.get('/', (req, res) => {
    res.send('Home Page')
})

app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// GET student by ID
app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID' });
  }
});
