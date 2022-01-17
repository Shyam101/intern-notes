import React, {useEffect, useCallback, useState} from 'react'
import { DateFormatOptions } from '../utils/functions'
import {Calendar} from '@natscale/react-calendar';
import '@natscale/react-calendar/dist/main.css';

import {auth, db} from '../firebase-config';
import {
    collection,
    query,
    where,
    addDoc,
    orderBy,
    doc,
    onSnapshot,
    updateDoc
} from 'firebase/firestore';
import {onAuthStateChanged} from 'firebase/auth';


const NotesPage = ({isMenuOpen, loading, setLoading}) => {


    const today = new Date();
    today.setHours(0,0,0,0);

    const [viewBy, setViewBy] = useState('day');
    const [note, setNote] = useState({msg: ''})
    const noteCollection = collection(db, "notes")
    const [day, setDay] = useState(today);
    const [monthNote, setMonthNote] = useState([]);
    const [userEmail, setUserEmail] = useState('')
    const [notification, setNotification] = useState({hidden:true, msg: ''})
    const [generalNotesOpen, setGeneralNotesOpen] = useState(false);

    // console.log(loading);

    useEffect(() => {
        console.log("called")
        if(generalNotesOpen) {
            const queryGeneral = query(noteCollection, where('type', '==', 'general'), where('postedBy', '==', userEmail))
            onSnapshot(queryGeneral, (snapshot) => {
                // console.log(snapshot)
                if(snapshot.empty) {
                    setNote({msg: ''})
                } else {
                    setNote({id: snapshot.docs.at(0).id, msg: snapshot.docs.at(0).data().msg})
                }   
            })
            return;
        }
        if(viewBy === 'day') {
            const queryDay = query(noteCollection, where('day', '==', day), where('postedBy', '==', userEmail))
            onSnapshot(queryDay, (snapshot) => {
                if(snapshot.empty) {
                    setNote({msg: ''})
                } else {
                    setNote({id: snapshot.docs.at(0).id, msg: snapshot.docs.at(0).data().msg})
                }   
            })
        } else {
            const firstDayOfMonth = new Date(day);
            firstDayOfMonth.setDate(1)
            const lastDayOfMonth = new Date(day.getFullYear(), day.getMonth() + 1, 0);
            const queryMonth = query(noteCollection, 
                    where('day', '>=', firstDayOfMonth), 
                    where('day', '<=', lastDayOfMonth), 
                    where('postedBy', '==', userEmail),
                    orderBy('day'))
            onSnapshot(queryMonth, (snapshot) => {
                let notesTemp = []
                snapshot.docs.forEach((doc) => notesTemp.push(doc.data()))
                // console.log(notesTemp)
                setMonthNote(notesTemp)
            })
        }        
    }, [day, viewBy, userEmail, generalNotesOpen])

    onAuthStateChanged(auth, (currentUser) => {
        if(currentUser) {
            setUserEmail(currentUser.email)
        }
        // console.log(currentUser)
    })

    const onChange = useCallback(
        (val) => {
        setDay(val);
        setGeneralNotesOpen(false)
        },
        [setDay],
    );

    const handleNoteChange = (e) => {
        setNote({...note, msg: e.target.value})
    }

    const saveOrUpdateNote = async () => {
        setNotification({hidden: false, msg:'Saving...'})
        if (note.id) {
            const noteDoc = doc(db, "notes", note.id);
            await updateDoc(noteDoc, {msg: note.msg});
        }
        else {
            if(generalNotesOpen) {
                await addDoc(noteCollection, {msg: note.msg, postedBy:userEmail, type: 'general'})
            } else {
                await addDoc(noteCollection, {day: day, msg: note.msg, postedBy: userEmail});
            }
        }
        setNotification({hidden:false, msg: 'Saved'})
        setTimeout(() => setNotification({hidden:true, msg: ''}), 1000)
    }

    const temp = () => {
        setGeneralNotesOpen(true)
        setViewBy('day')
        setDay(undefined)
    }

    return (
        <div className="row notes__page">
            {isMenuOpen &&
                <aside className="side__menu">
                    <div className='note__view'>
                        <label htmlFor="viewBy" className="label">View Notes By:</label>
                        <select name="viewBy" id="viewBy" value={viewBy} disabled={generalNotesOpen} onChange={(e) => setViewBy(e.target.value)}>
                            <option value="day">Day</option>
                            <option value="month">Month</option>
                        </select>
                    </div>
                    <div className='general__notes' onClick={temp}>
                        General Notes
                    </div>
                    <div className='Calendar__parent'>
                        <Calendar value={day} onChange={onChange} />
                    </div>
                </aside>
            }
            <div className='col flex--vertical note-container'>
            {!notification.hidden && <div id="notification">{notification.msg}</div>}
            {viewBy === 'day'
            ?    <>
                <div className='row note__area--heading'>
                    <h2>{!generalNotesOpen
                        ? day.toLocaleDateString('en-US', DateFormatOptions)
                        :'General Notes'}
                    </h2>
                    <button onClick={saveOrUpdateNote} className='btn btn--green btn--save__note'>Save</button>
                </div>
                    <textarea className='textareaElement col--full__hight' value={note.msg} onChange={handleNoteChange} placeholder='Take a new Note'/>
                </>
            :  <>
                {monthNote.map((note) => (
                    <>
                    <h2 className='note__area--heading'>{note.day.toDate().toLocaleDateString('en-US', DateFormatOptions)}</h2>
                    <p className='note__read__only'>{note.msg}</p>
                    </>
                ))}
            </>
            }
            </div>
        </div>
    )
}

export default NotesPage
