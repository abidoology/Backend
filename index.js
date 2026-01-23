const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // password hashing
const app = express();
app.use(express.json());

const connectDB = require('./config/db');
const Student = require('./models/Student');

connectDB();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, and PDF files are allowed'));
    }
  }
});

// Authentication Middleware - Verify JWT Token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Admin Middleware
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
  next();
};

// ====== ROUTES ======

// Home
app.get('/', (req, res) => {
  res.send('Home Page');
});

// Get all students
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Get student by ID
app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID' });
  }
});

// Search students by name (partial match)
app.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: 'Name query is required' });

    const students = await Student.find({ name: { $regex: name, $options: 'i' } });
    if (!students.length) return res.status(404).json({ message: 'Student not found' });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - create one or multiple students with custom ID
app.post('/students', async (req, res) => {
  try {
    let studentArray = [];

    if (Array.isArray(req.body.students)) {
      studentArray = req.body.students;
    } else if (req.body._id && req.body.name && req.body.dept) {
      studentArray = [req.body];
    } else {
      return res.status(400).json({ message: 'ID, Name and Dept are required' });
    }

    for (let student of studentArray) {
      if (!student._id || !student.name || !student.dept) {
        return res.status(400).json({ message: 'ID, Name and Dept are required' });
      }
      const exists = await Student.findById(student._id);
      if (exists) {
        return res.status(400).json({ message: `Student with ID ${student._id} already exists` });
      }
    }

    const createdStudents = await Student.insertMany(studentArray);
    res.status(201).json(createdStudents);

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

// DELETE - remove all students
app.delete('/students', async (req, res) => {
  try {
    await Student.deleteMany();
    res.json({ message: 'All students deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== AUTH ROUTES =====

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { _id, name, email, password, dept, isAdmin } = req.body;

    if (!_id || !name || !email || !password || !dept) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if student ID exists
    const existingStudent = await Student.findById(_id);
    if (existingStudent) return res.status(400).json({ message: 'Student ID already exists' });

    // Check if email exists
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already registered' });

    // Create new student WITHOUT hashing password
    const newStudent = new Student({
      _id,
      name,
      email,
      password, // plain text password
      dept,
      role: 'student',
      status: 'active',
      isAdmin: isAdmin || false
    });

    await newStudent.save();

    // Create JWT token
    const token = jwt.sign(
      { _id: newStudent._id, email: newStudent.email, isAdmin: newStudent.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      student: {
        _id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        dept: newStudent.dept,
        role: newStudent.role,
        isAdmin: newStudent.isAdmin
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const student = await Student.findOne({ email });
    if (!student) return res.status(401).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { _id: student._id, email: student.email, isAdmin: student.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        dept: student.dept,
        role: student.role,
        status: student.status
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Profile (Protected)
app.get('/auth/profile', authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Profile retrieved successfully', student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete student (Admin-only)
app.delete('/auth/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully by admin' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update status/role
app.patch('/students/:id/status', async (req, res) => {
  try {
    const { status, role } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: 'At least one field (status or role) is required' });
    }

    const student = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Student status/role updated successfully', student });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// File upload
app.post('/api/resource/:id/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.profilePic = req.file.path;
    await student.save();

    res.status(200).json({
      message: 'File uploaded successfully',
      filePath: req.file.path,
      fileName: req.file.filename,
      student
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
