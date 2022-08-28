const router = require('express').Router();
const verify = require('./verifyToken');

const Student = require('../model/Student');
const Lecturer = require('../model/Lecturer');
const Course = require('../model/Course');

const { Content, ContentVideo } = require('../model/Content');
const {
    Interactivity,
    SingleChoice,
    MultipleChoice,
    MatchPairs,
    TextEntry,
} = require('../model/Interactivity');

const {
    Submission,
    SingleChoiceSubmission,
    MultipleChoiceSubmission,
    MatchPairsSubmission,
    TextEntrySubmission,
} = require('../model/Submission');

const checkMultipleChoiceQuiz = (correct, submitted) => {
    return (
        correct.length === submitted.length &&
        correct.every((value, index) => value === submitted[index])
    );
};

const checkMatchPairs = (correct, submitted) => {
    return (
        correct.length === submitted.length &&
        correct.every((value, index) => value.toLowerCase() === submitted[index].toLowerCase())
    );
};

router.get('/courses', verify, async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.user._id });
        const courses = await Course.find({ students: student._id });

        res.send({ courses });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/course/:id', verify, async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.user._id });
        const course = await Course.findOne({
            _id: req.params.id
        }).populate('content');

        res.send({
            course,
            content: course.content
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/interactivity/:content', verify, async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.user._id });
        
        const video = await Content.findOne({
            _id: req.params.content
        }).populate('interactivity');

        const submissions = await Submission.find({
            video: req.params.content,
            student: student._id
        }).populate('interactivity');

        res.send({
            video: video,
            interactivity: video.interactivity,
            submissions: submissions
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/mysubmissions/:content', verify, async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.user._id });
        
        const submissions = await Submission.find({
            video: req.params.content,
            student: student._id
        }).populate('interactivity');

        res.send({ submissions: submissions });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/submission/:content/:interactivity', verify, async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.user._id });
        
        const course = await Course.findOne({
            _id: req.body.result.course
        });

        const video = await Content.findOne({
            _id: req.params.content
        }).populate('interactivity');

        const interactivity = await Interactivity.findOne({
            _id: req.params.interactivity
        });

        if (interactivity.kind === 'single') {
            let single = new SingleChoiceSubmission({
                student: student._id,
                course: course._id,
                video: video._id,
                interactivity: interactivity._id,
                score: 0,
                submitted: req.body.result.submitted,
            });
            if (interactivity.correct === req.body.result.submitted) { single.score = 1; }
            await single.save();
        }
        if (interactivity.kind === 'multiple') {
            let multiple = new MultipleChoiceSubmission({
                student: student._id,
                course: course._id,
                video: video._id,
                interactivity: interactivity._id,
                score: 0,
                submitted: req.body.result.submitted,
            });
            if (checkMultipleChoiceQuiz(interactivity.correct, req.body.result.submitted)) { multiple.score = 1; }
            await multiple.save();
        }
        if (interactivity.kind === 'match') {
            let match = new MatchPairsSubmission({
                student: student._id,
                course: course._id,
                video: video._id,
                interactivity: interactivity._id,
                score: 0,
                submitted: req.body.result.submitted,
            });
            if (checkMatchPairs(interactivity.secondary, req.body.result.submitted)) { match.score = 1; }
            await match.save();
        }
        if (interactivity.kind === 'text') {
            let textEntry = new TextEntrySubmission({
                student: student._id,
                course: course._id,
                video: video._id,
                interactivity: interactivity._id,
                score: 0,
                submitted: req.body.result.submitted,
            });
            if (interactivity.correct.toLowerCase() === req.body.result.submitted.toLowerCase()) { textEntry.score = 1; }
            await textEntry.save();
        }

        res.send({ success: true });
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
});

module.exports = router;
