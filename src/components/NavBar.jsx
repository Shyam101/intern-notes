import React from 'react'
import menuIcon from '../images/menu.svg';
import githubIcon from '../images/github.svg';
import { auth } from '../firebase-config'
import { signOut } from 'firebase/auth'


const NavBar = ({isMenuOpen, setIsMenuOpen, isUserLoggedIn}) => {

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <nav className='row nav'>
            {isUserLoggedIn && <img src={menuIcon} alt='blah blah' onClick={toggleMenu}/>}
            <span className='brand__title'>Intern Notes</span>
            <ul className='nav__list'>
                {isUserLoggedIn && <button onClick={logout} className='btn btn--green btn--hover__red'>Sing out</button>}
                <a href="https://github.com/Shyam101" className='nav__link'>
                    <div>Find me </div><img src={githubIcon} alt='fork on github'/>
                </a>
            </ul>
        </nav>
    )
}

export default NavBar
