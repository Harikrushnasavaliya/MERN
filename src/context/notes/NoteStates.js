import React, { useState, useEffect } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial);

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = async () => {
        try {
            const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem("token"),                },
            });
            if (response.ok) {
                const json = await response.json();
                setNotes(json);
            } else {
                console.error('Failed to fetch notes');
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }

    const addNote = async (title, description, tag) => {
        try {
            const response = await fetch(`${host}/api/notes/addnote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem("token"),
                },
                body: JSON.stringify({ title, description, tag })
            });
            // const newNote = {
            //     "_id": "66033aac860ed5da45994c2c",
            //     "user": "6601da5d2fcf33e899dff589",
            //     "title": title,
            //     "description": description,
            //     "tag": tag,
            //     "__v": 0
            // };
            if (response.ok) {
                const newNote = await response.json();
                setNotes([...notes, newNote]);
            } else {
                console.error('Failed to add note');
            }
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const editNote = async (id, title, description, tag) => {
        try {
            const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem("token"),                },
                body: JSON.stringify({ title, description, tag })
            });
            const json = await response.json();
            setNotes(json);
        } catch (error) {
            console.error('Error editing note:', error);
        }
    }


    const deleteNote = async (id) => {
        try {
            const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem("token"),                },
            });
            if (response.ok) {
                const json = await response.json();
                const updatedNotes = notes.filter(note => note._id !== id);
                setNotes(updatedNotes, json);
            } else {
                console.error('Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };




    return (
        <NoteContext.Provider value={{ notes, addNote, editNote, deleteNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
