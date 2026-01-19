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

