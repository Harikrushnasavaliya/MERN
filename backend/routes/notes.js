const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


router.get('/fetchallnotes', fetchUser, async (req, res) => {
    debugger
    try {
        if (req.user.id === 'Add your User ID') {
            const notes = await Note.find();
            console.log(notes);
            res.json(notes);
        } else {
            const notes = await Note.find({ user: req.user.id });
            console.log(notes);
            res.json(notes);
        }
    } catch (error) {
        console.error('Error fetching notes:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching notes' });
    }
});



router.post('/addnote', fetchUser, [
    body('title', 'hum pe to hehi na').isLength({ min: 3 }),
    body('description', 'Description atleast 5 characters').isLength({ min: 5 }), async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()
            res.json(savedNote)

        } catch (error) {
            console.error('Error saving user:', error.message);
            res.status(500).json({ error: 'An error occurred while saving user' });
        }
    }
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const notes = await Note.find({ user: req.user.id });
    res.json(notes)
})




router.put('/updatenote/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send('Not Found')
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed');
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error('Error saving user:', error.message);
        res.status(500).json({ error: 'An error occurred while saving user' });
    }
})




router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send('Not Found')
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Not Allowed');
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error saving user:', error.message);
        res.status(500).json({ error: 'An error occurred while saving user' });
    }
})



module.exports = router
