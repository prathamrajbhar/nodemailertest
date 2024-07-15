const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const path = require('path')

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Store email addresses and form data routes
const emailRoutes = {};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rajbharpratham200@gmail.com', // replace with your email
    pass: 'fvwb ozlp mppj ycse'   // replace with your email password
  }
});

// Endpoint to generate a unique link for form submission
app.post('/generate-link', (req, res) => {
  const { email } = req.body;
  const uniqueId = uuidv4();
  emailRoutes[uniqueId] = email;
  const link = `http://localhost:${port}/submit-form/${uniqueId}`;
  res.send({ link });
});

// Endpoint to handle form submission
app.post('/submit-form/:id', (req, res) => {
  const { id } = req.params;
  const email = emailRoutes[id];
  if (!email) {
    return res.status(404).send('Invalid link');
  }

  const formData = req.body;
  const emailContent = Object.entries(formData)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  // Send email
  const mailOptions = {
    from: 'rajbharpratham200@gmail.com', // replace with your email
    to: email,
    subject: 'Form Submission',
    text: emailContent
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.send('Form data sent via email');
  });
});

// Simple dashboard to enter email and get form link
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});