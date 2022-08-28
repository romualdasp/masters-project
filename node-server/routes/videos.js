const router = require('express').Router();
const verify = require('./verifyToken');

const User = require('../model/Lecturer');
const { Course } = require('../model/Course');
const Video = require('../model/Video');

router.post('/create', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });

    const video = new Video({
        _owner: user._id,
        title: req.body.title,
        url: req.body.url
    });

    try {
        const savedVideo = await video.save();
        res.send({ _id: savedVideo._id, title: savedVideo.title });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/update/:id', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });

    try {
        const updatedVideo = await Video.findOneAndUpdate(
            { _owner: user._id, _id: req.params.id },
            {
                title: req.body.title,
                url: req.body.url
            }
        );

        res.send({_id: updatedVideo._id, title: updatedVideo.title});
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/delete/:id', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });

    try {
        const deletedVideo = await Video.findOneAndDelete({ _owner: user._id, _id: req.params.id });
        res.send({_id: deletedVideo._id, title: deletedVideo.title});
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:id', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    const video = await Video.findOne({ _owner: user._id, _id: req.params.id });

    res.json({
        user: { id: user._id, name: user.name },
        video: video
    });
});

router.get('/', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    const videos = await Course.find({ _owner: user._id });

    res.json({
        user: { id: user._id, name: user.name },
        videos: videos
    });
});

module.exports = router;
