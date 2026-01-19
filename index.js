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

// POST - create new student
app.post('/students', async (req, res) => {
  try {
    const { name, dept } = req.body;

    if (!name || !dept) {
      return res.status(400).json({ message: 'Name and Dept are required' });
    }

    const student = await Student.create({ name, dept });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - update student by ID
app.put('/students/:id', async (req, res) => {
  try {
    const { name, dept } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, dept },
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json(student);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID or data' });
  }
});

// DELETE - remove student by ID
app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID' });
  }
});

app.listen(3000, () => {
    console.log('Server started on port 3000')
})
