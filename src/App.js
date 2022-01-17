import './App.css';
import LoginPage from './components/LoginPage';
import NavBar from './components/NavBar';
import NotesPage from './components/NotesPage';
import '@natscale/react-calendar/dist/main.css';
import React, {useState} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import { auth } from './firebase-config'

function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(window.outerWidth > 600)
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)

  onAuthStateChanged(auth, (currentUser) => {
        if(currentUser) {
            setUserEmail(currentUser.email)
        } else {
            setUserEmail('')
        }
        setLoading(false)
        // console.log(currentUser)
    })
    
  return (
    <div className="App flex--vertical">
      {/* <div id="overlay"></div> */}
      <NavBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isUserLoggedIn={userEmail}/>
      <main className='main col--full__hight'>
        {userEmail 
        ? <NotesPage isMenuOpen={isMenuOpen} loading={loading} setLoading={setLoading}/>
        : <LoginPage />
        }
      </main>
      {loading && <div id="overlay">
                      <div class="loader"></div>
                  </div>
      }
    </div>

    
  );
}

export default App;
