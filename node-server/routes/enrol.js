const router = require('express').Router();
const verify = require('./verifyToken');

const Student = require('../model/Student');
const Lecturer = require('../model/Lecturer');
const Course = require('../model/Course');

router.get('/students/:id', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        let students;

        if (lecturer.verified) {
            students = await Student.find({});
        }

        const course = await Course.findOne({
            _owner: lecturer._id,
            _id: req.params.id
        }).populate('students');

        res.send({
            students: students,
            enrolled: course.students
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.get('/allstudents', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        
        if (lecturer.verified) {
            const students = await Student.find({});
            res.send({ students });
        }

        res.send({ students: [] });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/enrolledstudents/:id', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        const course = await Course.findOne({
            _owner: lecturer._id,
            _id: req.params.id
        }).populate('students');

        res.send({ students: course.students });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/add/:course/:student', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        
        const course = await Course.findOne({
            _owner: lecturer._id,
            _id: req.params.course
        });

        const student = await Student.findOne({ _id: req.params.student });

        if (!course.students.includes(student._id)) {
            course.students.push(student._id);
            await course.save();
        }
        
        const updatedCourse = await Course.findOne({
            _owner: lecturer._id,
            _id: req.params.course
        }).populate('students');

        res.send({
            enrolled: updatedCourse.students
        });
    } catch (err) {
        res.status(400).send(err);
    }
});


router.post('/remove/:course/:student', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        
        const course = await Course.findOne({
            _owner: lecturer._id,
            _id: req.params.course
        });

        const student = await Student.findOne({ _id: req.params.student });

        // remove the student from the enrolled list
        if (course && course.students.includes(student._id)) {
            course.students = course.students.filter(el =>
                el.toString() != student._id.toString()
            );
            await course.save();
        }
        
        const updatedCourse = await Course.findOne({
            _owner: lecturer._id,
            _id: req.params.course
        }).populate('students');

        res.send({
            enrolled: updatedCourse.students
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
