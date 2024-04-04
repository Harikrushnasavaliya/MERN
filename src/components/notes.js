import React, { useContext, useEffect, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import Noteitem from './Noteitem';
import AddNote from './addNote';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const Notes = () => {
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context;
    const [visible, setVisible] = useState(false);
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "default" });


    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await editNote(note.id, note.etitle, note.edescription, note.etag);
            await getNotes();
            onHide();
        } catch (error) {
            console.error('Error', error);
        }
    }

    const updateNote = (currentNote) => {
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
        setVisible(true);
    };



    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        getNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const onHide = () => {
        setVisible(false);
    };


    return (
        <>
            <AddNote />
            <div>
                {(!notes || notes.length === 0) && <p>No notes found</p>}
            </div>
            <Dialog
                className="custom-dialog"
                header="Edit Note"
                visible={visible}
                onHide={onHide}
                style={{ width: '300px' }}
                headerStyle={{ backgroundColor: '#007bff', color: '#ffffff', textAlign: 'center' }}
                footerClassName="custom-footer"
            >
                <div style={{ padding: '1rem' }}>
                    <input type="text" className="form-control etitle" id="etitle" value={note.etitle} onChange={onChange} name="etitle" placeholder="Enter title" />
                    <textarea className="form-control edescription" id="edescription" rows="3" value={note.edescription} onChange={onChange} name="edescription" placeholder="Enter description"></textarea>
                    <input type="text" className="form-control etag" id="etag" value={note.etag} onChange={onChange} name="etag" placeholder="Enter tag" />
                </div>
                <div className="text-center">
                    <Button label="Save changes" onClick={handleClick} className="p-button-primary" />
                </div>
            </Dialog>

            <div>
                <div className="row my-3">
                    <h2>Your Notes</h2>
                    {Array.isArray(notes) && notes.map((note, index) => (
                        <Noteitem key={`${note._id}-${index}`} updateNote={updateNote} note={note} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Notes;
