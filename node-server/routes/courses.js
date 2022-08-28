const router = require('express').Router();
const verify = require('./verifyToken');

const Lecturer = require('../model/Lecturer');
const Course = require('../model/Course');

const path = require("path");
const multer = require('multer');
const fs = require('fs');
const { promisify } = require('util');
const deleteFileAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
    destination: './files/',
    filename: function (req, file, cb) {
        cb(null, 'img-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/create', [verify, upload.single("courseimg")], async (req, res) => {
    const lecturer = await Lecturer.findOne({ _id: req.user._id });

    // check if course title already in database
    const courseExists = await Course.findOne({ title: req.body.title });
    if (courseExists) return res.status(400).send('Course title already exists');

    const course = new Course({
        _owner: lecturer._id,
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        image: req.file.filename
    });

    try {
        const savedCourse = await course.save();
        res.send({ course: savedCourse });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/update/:id', verify, async (req, res) => {
    const lecturer = await Lecturer.findOne({ _id: req.user._id });

    if (req.body.titleChanged) {
        // check if course title already in database
        const courseExists = await Course.findOne({ title: req.body.title });
        if (courseExists) return res.status(400).send('Course title already exists');
    }

    try {
        const updatedCourse = await Course.findOneAndUpdate(
            {
                _owner: lecturer._id,
                _id: req.params.id
            },
            {
                title: req.body.title,
                description: req.body.description,
                code: req.body.code
            },
            { new: true }
        );

        res.send({ course: updatedCourse });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/updateimage/:id', [verify, upload.single("courseimg")], async (req, res) => {
    const lecturer = await Lecturer.findOne({ _id: req.user._id });

    try {
        const course = await Course.findOne({ _owner: lecturer._id, _id: req.params.id });
        await deleteFileAsync('./files/' + course.image);

        course.image = req.file.filename;
        const updatedCourse = await course.save();

        res.send({ course: updatedCourse });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/delete/:id', verify, async (req, res) => {
    const lecturer = await Lecturer.findOne({ _id: req.user._id });

    try {
        const deletedCourse = await Course.findOneAndDelete({ _owner: lecturer._id, _id: req.params.id });
        await deleteFileAsync('./files/' + deletedCourse.image);
        res.send({ course: deletedCourse });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:id', verify, async (req, res) => {
    const lecturer = await Lecturer.findOne({ _id: req.user._id });
    
    try {
        const course = await Course.findOne({ _owner: lecturer._id, _id: req.params.id });
        res.send({ course: course });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/', verify, async (req, res) => {
    const lecturer = await Lecturer.findOne({ _id: req.user._id });

    try {
        const courses = await Course.find({ _owner: lecturer._id });

        res.send({
            user: { _id: lecturer._id, name: lecturer.name, email: lecturer.email },
            courses: courses
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
