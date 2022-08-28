const router = require('express').Router();
const verify = require('./verifyToken');

const Lecturer = require('../model/Lecturer');
const Course = require('../model/Course');
//const Video = require('../model/Video');
const { Content, ContentVideo } = require('../model/Content');
const {
    Interactivity,
    SingleChoice,
    MultipleChoice,
    MatchPairs,
    TextEntry,
} = require('../model/Interactivity');

router.post('/:id/create/:content', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        const video = await Content.findOne({ _id: req.params.content });

        let interactivity;
        if (req.body.kind === 'single') {
            const single = new SingleChoice({
                kind: req.body.kind,
                question: req.body.question,
                timestamp: req.body.timestamp,
                answers: req.body.answers,
                correct: req.body.correct
            });
            interactivity = await single.save();
        }
        if (req.body.kind === 'multiple') {
            const multiple = new MultipleChoice({
                kind: req.body.kind,
                question: req.body.question,
                timestamp: req.body.timestamp,
                answers: req.body.answers,
                correct: req.body.correct
            });
            interactivity = await multiple.save();
        }
        if (req.body.kind === 'match') {
            const match = new MatchPairs({
                kind: req.body.kind,
                question: req.body.question,
                timestamp: req.body.timestamp,
                primary: req.body.primary,
                secondary: req.body.secondary
            });
            interactivity = await match.save();
        }
        if (req.body.kind === 'text') {
            const text = new TextEntry({
                kind: req.body.kind,
                question: req.body.question,
                timestamp: req.body.timestamp,
                correct: req.body.correct
            });
            interactivity = await text.save();
        }

        video.interactivity.push(interactivity._id);
        await video.save();

        const updatedVideo = await Content.findOne({
            _id: req.params.content
        }).populate('interactivity');

        res.send({
            user: { id: lecturer._id, name: lecturer.name },
            video: updatedVideo,
            interactivity: updatedVideo.interactivity
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.post('/:id/delete/:content/:interactivity', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        const video = await Content.findOne({ _id: req.params.content });

        video.interactivity = video.interactivity.filter(el =>
            el.toString() != req.params.interactivity
        );
        await video.save();

        const updatedVideo = await Content.findOne({
            _id: req.params.content
        }).populate('interactivity');

        res.send({
            user: { id: lecturer._id, name: lecturer.name },
            video: updatedVideo,
            interactivity: updatedVideo.interactivity
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:id/:content', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });

        const video = await Content.findOne({
            _id: req.params.content
        }).populate('interactivity');

        res.send({
            user: { id: lecturer._id, name: lecturer.name },
            video: video,
            interactivity: video.interactivity
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;

// create all
// delete all
// read all

// router.post('/:id/createall', verify, async (req, res) => {
//     const user = await User.findOne({ _id: req.user._id });
//     const video = await Video.findOne({ _owner: user._id, _id: req.params.id });

//     for (inter of req.body.interactivity) {
//         video.interactivity.push({
//             timestamp: inter.timestamp,
//             type: inter.type,
//             question: inter.question,
//             answers: inter.answers
//         });
//     }
    
//     try {
//         const updatedVideo = await video.save();

//         res.json({
//             user: { id: user._id, name: user.name },
//             video: updatedVideo,
//             interactivity: updatedVideo.interactivity
//         });
//     } catch (err) {
//         res.status(400).send(err);
//     }
// });

// router.post('/:id/deleteall', verify, async (req, res) => {
//     const user = await User.findOne({ _id: req.user._id });

//     try {
//         const updatedVideo = await Video.findOneAndUpdate(
//             { _owner: user._id, _id: req.params.id },
//             { "$set": { interactivity: [] } },
//             { new: true }
//         )

//         res.send({_id: updatedVideo._id, title: updatedVideo.title, video: updatedVideo });
//     } catch (err) {
//         res.status(400).send(err);
//     }
// });

// router.get('/:id', verify, async (req, res) => {
//     const user = await User.findOne({ _id: req.user._id });
//     const video = await Video.findOne({ _owner: user._id, _id: req.params.id });

//     res.json({
//         user: { id: user._id, name: user.name },
//         video: video,
//         interactivity: video.interactivity
//     });
// });

/*
const video = await Video.findById('61f0769c6783273bf8d137b1');
video.interactivity.push({ timestamp: 250, type: 'Multiple Choice Quiz', question: 'What u see?', answers: ['aa', 'bb', 'cc'] });
const updatedVideo = await video.save();

video.interactivity.id(video.interactivity[0]._id).remove();
const updatedVideo = await video.save();
*/
