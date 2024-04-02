const express = require('express');
const User = require('../models/User');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_Secret = "Humpe to he hi na";
let success = false;



router.post('/createuser', [
    body('name', 'hum pe to hehi na').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingUser = await User.findOne({ $or: [{ email: req.body.email }, { name: req.body.name }] });
        if (existingUser) {
            const errorFields = [];
            if (existingUser.email === req.body.email) {
                errorFields.push('email');
            }
            if (existingUser.name === req.body.name) {
                errorFields.push('name');
            }
            return res.status(400).json({ error: `User with this ${errorFields.join(' and ')} already exists` });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });
        const Data = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password
            }
        };
        const token = jwt.sign(Data, JWT_Secret);
        success = true;
        res.json({ success, token });
    } catch (error) {
        console.error('Error saving user:', error.message);
        res.status(500).json({ error: 'An error occurred while saving user' });
    }
})






router.post('/login', [
    // body('name', 'hum pe to hehi na').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank!').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: "Please enter correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ errors: "Please enter correct credentials" });
        }

        const Data = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password
            }
        };
        const token = jwt.sign(Data, JWT_Secret);
        success = true;
        res.json({ success, token });
        console.log(token);
        // }
    } catch (error) {
        console.error('Error saving user:', error.message);
        res.status(500).json({ error: 'An error occurred while saving user' });
    }
})






router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while saving user');
    }
})
module.exports = router;