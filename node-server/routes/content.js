const router = require('express').Router();
const verify = require('./verifyToken');

const Lecturer = require('../model/Lecturer');
const Course = require('../model/Course');

const {
    Content,
    ContentHeading,
    ContentParagraph,
    ContentVideo
} = require('../model/Content');

const path = require("path");
const multer = require('multer');
const fs = require('fs');
const { promisify } = require('util');
const deleteFileAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
    destination: './files/',
    filename: function (req, file, cb) {
        cb(null, 'vid-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/:id/create', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        const course = await Course.findOne({ _owner: lecturer._id, _id: req.params.id });

        let savedContent;

        if (req.body.kind === 'heading') {
            const heading = new ContentHeading({
                kind: req.body.kind,
                value: req.body.value
            });
            savedContent = await heading.save();
        }

        if (req.body.kind === 'paragraph') {
            const paragraph = new ContentParagraph({
                kind: req.body.kind,
                value: req.body.value
            });
            savedContent = await paragraph.save();
        }

        course.content.push(savedContent._id);
        await course.save();

        const updatedCourse = await Course.findOne({
            _owner: lecturer._id,
            _id: req.params.id
        }).populate('content');

        res.send({
            user: { id: lecturer._id, name: lecturer.name },
            course: updatedCourse,
            content: updatedCourse.content
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/:id/createvideo', [verify, upload.single("contentvid")], async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        const course = await Course.findOne({ _owner: lecturer._id, _id: req.params.id });

        let savedContent;

        if (req.body.kind === 'video') {
            const video = new ContentVideo({
                kind: req.body.kind,
                title: req.body.title,
                video: req.file.filename
            });
            savedContent = await video.save();
        }

        course.content.push(savedContent._id);
        await course.save();

        const updatedCourse = await Course.findOne({
            _owner: lecturer._id,
            _id: req.params.id
        }).populate('content');

        res.send({
            user: { id: lecturer._id, name: lecturer.name },
            course: updatedCourse,
            content: updatedCourse.content
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.get('/:id', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });

        const course = await Course.findOne({
            _owner: lecturer._id,
            _id: req.params.id
        }).populate('content');

        res.send({
            user: { id: lecturer._id, name: lecturer.name },
            course: course,
            content: course.content
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/:id/delete/:content', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        const course = await Course.findOne({ _owner: lecturer._id, _id: req.params.id });

        course.content = course.content.filter(el => {
            return el.toString() != req.params.content
        });
        await course.save();

        const updatedCourse = await Course.findOne({
            _owner: lecturer._id,
            _id: req.params.id
        }).populate('content');

        res.send({
            user: { id: lecturer._id, name: lecturer.name },
            course: updatedCourse,
            content: updatedCourse.content
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/:id/update/:content', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        const course = await Course.findOne({ _owner: lecturer._id, _id: req.params.id });

        const content = await Content.findOne({ _id: req.params.content });
        
        if (req.body.kind === 'heading' || req.body.kind === 'paragraph') {
            content.value = req.body.value;
        }
        if (req.body.kind === 'video') {
            content.title = req.body.title;
        }

        await content.save();

        const updatedCourse = await Course.findOne({
            _owner: lecturer._id,
            _id: req.params.id
        }).populate('content');

        res.send({
            user: { id: lecturer._id, name: lecturer.name },
            course: updatedCourse,
            content: updatedCourse.content
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/:id/reorder/:content', verify, async (req, res) => {
    try {
        const lecturer = await Lecturer.findOne({ _id: req.user._id });
        const course = await Course.findOne({ _owner: lecturer._id, _id: req.params.id });

        let cont = [...course.content];
        let i = req.body.index;
        switch (req.body.direction) {
            case 'up':
                if (i > 0) {
                    [cont[i], cont[i-1]] = [cont[i-1], cont[i]];
                }
                break;
            case 'down':
                if (i < cont.length - 1) {
                    [cont[i], cont[i+1]] = [cont[i+1], cont[i]];
                }
                break;
            default:
                // case left empty
        }
        course.content = cont;
        await course.save();

        const updatedCourse = await Course.findOne({
            _owner: lecturer._id,
            _id: req.params.id
        }).populate('content');

        res.send({
            user: { id: lecturer._id, name: lecturer.name },
            course: updatedCourse,
            content: updatedCourse.content
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;

// router.post('/:id/createall', verify, async (req, res) => {
//     const user = await User.findOne({ _id: req.user._id });
//     const course = await Course.findOne({ _owner: user._id, _id: req.params.id });

//     for (cont of req.body.content) {
//         course.content.push({ type: cont.type, value: cont.value });
//     }
    
//     try {
//         const updatedCourse = await course.save();

//         res.json({
//             user: { id: user._id, name: user.name },
//             course: updatedCourse,
//             content: updatedCourse.content
//         });
//     } catch (err) {
//         res.status(400).send(err);
//         console.log(err);
//     }
// });

// router.post('/:id/update/:contid', verify, async (req, res) => {
//     const user = await User.findOne({ _id: req.user._id });

//     try {
//         const updatedCourse = await Course.findOneAndUpdate(
//             { _owner: user._id, _id: req.params.id, "content._id": req.params.contid },
//             {
//                 "content.$": { _id: req.params.contid, type: req.body.type, value: req.body.value }
//             },
//             { new: true }
//         );

//         // await User.updateOne({ 'addresses._id': oldAddressId }, { 'addresses.$': newAddress });
//         // const userAfterUpdate = await User.findOne({ _id: user._id });

//         res.send({_id: updatedCourse._id, title: updatedCourse.title, course: updatedCourse });
//     } catch (err) {
//         res.status(400).send(err);
//     }

// });

// router.post('/:id/delete/:contid', verify, async (req, res) => {
//     const user = await User.findOne({ _id: req.user._id });

//     try {
//         const updatedCourse = await Course.findOneAndUpdate(
//             { _owner: user._id, _id: req.params.id },
//             { "$pull": { content: { _id: req.params.contid } } },
//             { new: true }
//         )

//         res.send({_id: updatedCourse._id, title: updatedCourse.title, course: updatedCourse });
//     } catch (err) {
//         res.status(400).send(err);
//     }
// });

// router.post('/:id/deleteall', verify, async (req, res) => {
//     const user = await User.findOne({ _id: req.user._id });

//     try {
//         const updatedCourse = await Course.findOneAndUpdate(
//             { _owner: user._id, _id: req.params.id },
//             { "$set": { content: [] } },
//             { new: true }
//         )

//         res.send({_id: updatedCourse._id, title: updatedCourse.title, course: updatedCourse });
//     } catch (err) {
//         res.status(400).send(err);
//     }
// });

// router.post('/:id/updateall', verify, async (req, res) => {
//     const user = await User.findOne({ _id: req.user._id });

//     const subDocuments = req.body.content?.map(
//         (object) => new CourseContent({ type: object.type, value: object.value })
//     );
//     console.log(req.body)
//     console.log(req.body.content);
//     console.log(subDocuments);
    
//     const course = await Course.findOneAndUpdate(
//         { _owner: user._id, _id: req.params.id },
//         { content: subDocuments },
//         { new: true }
//     );

//     console.log('UPDATEEEEEEEEEEEEEEEEEEEEEEEEEEEED');
//     console.log(course);


//     res.json({
//         user: { id: user._id, name: user.name },
//         course: course,
//         content: course.content
//     });
// });

// router.get('/:id', verify, async (req, res) => {
//     const user = await User.findOne({ _id: req.user._id });
//     const course = await Course.findOne({ _owner: user._id, _id: req.params.id });

//     res.json({
//         user: { id: user._id, name: user.name },
//         course: course,
//         content: course.content
//     });
// });

// router.get('/:id/:contid', verify, async (req, res) => {
//     const user = await User.findOne({ _id: req.user._id });
//     const course = await Course.find({ _owner: user._id, _id: req.params.id });

//     let content = course.content.id(req.params.contid);

//     res.json({
//         user: { id: user._id, name: user.name },
//         course: course,
//         content: content
//     });
// });
