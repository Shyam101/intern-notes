// NotesPage  dumped at = 8/1/2022 4:13

import React, {useState} from 'react'
import {auth, db} from '../firebase-config';
import {
    collection,
    query,
    where,
    addDoc,
    onSnapshot
} from 'firebase/firestore';
import {onAuthStateChanged} from 'firebase/auth';

const NotesPage = () => {

    const [note, setNote] = useState({})
    const [loggedInUser, setLoggedInUser] = useState({})


    const handleChange = (e) => {
        setNote({
            ...note,
            [e.target.name]: e.target.value
        })
    }

    onAuthStateChanged(auth, (currentUser) => {
        setLoggedInUser(currentUser)
        const today = new Date();
        if (loggedInUser !== undefined && today !== undefined) { // const qg = query(noteCollection, where('postedBy', '==', loggedInUser.email), where("day", '==', today));
            const qg = query(noteCollection, where('day', '==', new Date("2022-01-11")), where('postedBy', '==', currentUser.email))
            onSnapshot(qg, (snapshot) => {
                let books = []
                snapshot.docs.forEach(doc => {
                    books.push({
                        ...doc.data(),
                        id: doc.id
                    })
                })
                console.log(books)
            })
        }
    });

    const noteCollection = collection(db, "notes")

    const saveNote = async (e) => {
        e.preventDefault();
        await addDoc(noteCollection, {
            day: new Date(note.day),
            note: note.note,
            postedBy: loggedInUser.email
        });
    }

    // noteCollection
    // day query
    // const q = query(noteCollection, where('day', '==', new Date("2022-01-11")))

    // //day range query
    // const qd = query(noteCollection,
    //     where('day', ">=", new Date("2022-01-01")),
    //     where('day', "<=", new Date("2022-01-31")));


    // const qdd = query(noteCollection, where('postedBy', '==', 'sv12@gmail.com'));


    // onSnapshot(qdd, (snapshot) => {
    //     let books = []
    //     snapshot.docs.forEach(doc => {
    //         books.push({ ...doc.data(), id: doc.id })
    //     })
    //     console.log(books)
    // })

    return (<div>
        <form onSubmit={saveNote}>
            <input type="date" name='day'
                value={
                    note.day
                }
                onChange={handleChange}/>
            <br/>
            <input type="textarea" name="note"
                value={
                    note.note
                }
                onChange={handleChange}/>
            <input type="submit" placeholder='Save'/>
        </form>
    </div>)
}

export default NotesPage

