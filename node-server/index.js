const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const lecturerAuthRoute = require('./routes/lecturer');
const studentAuthRoute = require('./routes/student');
const enrolRoute = require('./routes/enrol');
const courseRoute = require('./routes/courses');
const courseContentRoute = require('./routes/content');
const videoRoute = require('./routes/videos');
const interactivityRoute = require('./routes/interactivity');
const mobileRoute = require('./routes/mobile');
const scoresRoute = require('./routes/scores');

const verify = require('./routes/verifyToken');

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('connected to db!')
);

app.use(express.json());
app.use(cors());
app.use('/files', [express.static(__dirname + '/files')]); //verify, 

app.use('/lecturer', lecturerAuthRoute);
app.use('/student', studentAuthRoute);
app.use('/enrol', enrolRoute);
app.use('/api/course', courseRoute);
app.use('/api/content', courseContentRoute);
app.use('/api/video', videoRoute);
app.use('/api/interactivity', interactivityRoute);
app.use('/api/mobile', mobileRoute);
app.use('/api/scores', scoresRoute);

app.listen(7000, '0.0.0.0', () => console.log('Server is running..'));
