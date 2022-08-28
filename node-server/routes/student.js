const router = require('express').Router();
const Student = require('../model/Student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation,loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if student already in database
    const studentExists = await Student.findOne({ email: req.body.email });
    if (studentExists) return res.status(400).send('Email is already in use.');

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const student = new Student({
        name: req.body.name,
        id: req.body.id,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedStudent = await student.save();
        res.send({ student: savedStudent });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if student email is present in the database
    const student = await Student.findOne({ email: req.body.email });
    if (!student) return res.status(400).send('The email address and/or password is incorrect.');

    //check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, student.password);
    if (!validPassword) return res.status(400).send('The email address and/or password is incorrect.');

    // create and assign a token
    const token = jwt.sign({ _id: student._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({ token, student });
});

module.exports = router;