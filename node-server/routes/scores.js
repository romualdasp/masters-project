const router = require('express').Router();
const verify = require('./verifyToken');

const Lecturer = require('../model/Lecturer');
const Student = require('../model/Student');
const Course = require('../model/Course');
const { Content, ContentVideo } = require('../model/Content');

const {
    Submission,
    SingleChoiceSubmission,
    MultipleChoiceSubmission,
    MatchPairsSubmission,
    TextEntrySubmission,
} = require('../model/Submission');

const calculatePerStudentScore = (submissions, course, total) => {
    let finalScores = [];

    for (const student of course.students) {
        let studentSubmissions = submissions.filter((submission) => {
            return submission.student._id.toString() === student._id.toString()
        });

        let correctSubmissions = studentSubmissions.filter((submission) => {
            return submission.score === 1;
        });

        let engagement = 0;
        let engagementPercentage = 0;
        let score = 0;
        let scorePercentage = 0;

        if (total > 0) {
            engagement = studentSubmissions.length;
            engagementPercentage = Math.round(engagement / total * 100);
        }

        if (engagement > 0) {
            score = correctSubmissions.length;
            scorePercentage = Math.round(score / engagement * 100);
        }

        finalScores.push({
            _id: student._id,
            name: student.name,
            total: total,
            engagement: engagement,
            engagementPercentage: engagementPercentage,
            score: score,
            scorePercentage: scorePercentage
        });
    }

    return finalScores;
};

router.get('/:id/', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });

        let total = 0;
        let course = await Course.findOne({
            _id: req.params.id,
            _owner: lecturer._id
        }).populate('content');

        for (const content of course.content) {
            if (content.kind === 'video') {
                total += content.interactivity.length;
            }
        }

        course = await Course.findOne({
            _id: req.params.id,
            _owner: lecturer._id
        }).populate('students');

        const submissions = await Submission.find({
            course: req.params.id
        }).populate('student');

        let finalScores = calculatePerStudentScore(submissions, course, total);

        res.send({ scores: finalScores });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/lecture/:id/', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });

        let course = await Course.findOne({
            _id: req.params.id,
            _owner: lecturer._id
        }).populate('content');

        let courseStudents = await Course.findOne({
            _id: req.params.id,
            _owner: lecturer._id
        }).populate('students');

        const submissions = await Submission.find({
            course: req.params.id
        }).populate('student');

        let finalPerVideoScores = [];
        for (const content of course.content) {
            if (content.kind === 'video') {
                let totalPerVideo = content.interactivity.length;

                let submissionsPerVideo = submissions.filter((submission) => {
                    return content._id.toString() === submission.video.toString()
                });

                let finalScores = calculatePerStudentScore(submissionsPerVideo, courseStudents, totalPerVideo);

                let averageEngagement = 0;
                let averageScore = 0;

                for (const student of finalScores) {
                    averageEngagement += student.engagementPercentage;
                    averageScore += student.scorePercentage;
                }

                if (finalScores.length > 0) {
                    averageEngagement = Math.round(averageEngagement / finalScores.length);
                    averageScore = Math.round(averageScore / finalScores.length);
                }

                finalPerVideoScores.push({
                    _id: content._id,
                    video: content.video,
                    lectureTitle: content.title,
                    averageEngagement: averageEngagement,
                    averageScore: averageScore
                });
            }
        }

        res.send({ scores: finalPerVideoScores });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/student/:student/', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        let student = await Student.findOne({ _id: req.params.student });

        let courses = await Course.find({
            students: req.params.student
        }).populate('content');

        const submissions = await Submission.find({
            student: req.params.student
        }).populate('student');

        let finalPerCourseScores = [];
        for (const course of courses) {
            let total = 0;

            for (const content of course.content) {
                if (content.kind === 'video') {
                    total += content.interactivity.length;
                }
            }

            let submissionsPerCourse = submissions.filter((submission) => {
                return course._id.toString() === submission.course.toString()
            });

            let finalScore = calculatePerStudentScore(submissionsPerCourse, { students: [student] }, total);
            
            finalPerCourseScores.push({
                ...(finalScore[0]),
                title: course.title,
                name: student.name
            });
        }

        res.send({ scores: finalPerCourseScores, studentName: student.name });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
