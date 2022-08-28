const router = require('express').Router();
const Lecturer = require('../model/Lecturer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const verificationCode = '8823540088';

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if lecturer is already in database
    const lecturerExists = await Lecturer.findOne({ email: req.body.email });
    if (lecturerExists) return res.status(400).send('Email is already in use.');

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const lecturer = new Lecturer({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    if (req.body.verification === verificationCode) {
        lecturer.verified = true;
    }

    try {
        const savedLecturer = await lecturer.save();
        res.send({ lecturer: savedLecturer });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if lecturer email is present in the database
    const lecturer = await Lecturer.findOne({ email: req.body.email });
    if (!lecturer) return res.status(400).send('The email address and/or password is incorrect.');

    //check if password correct
    const validPass = await bcrypt.compare(req.body.password, lecturer.password);
    if (!validPass) return res.status(400).send('The email address and/or password is incorrect.');

    // create and assign a token
    const token = jwt.sign({ _id: lecturer._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({ token, lecturer });
});

module.exports = router;