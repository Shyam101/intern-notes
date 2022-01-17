import React, { useState } from 'react'
import { auth } from "../firebase-config";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth'

const LoginPage = () => {

    const [user, setUser] = useState({});
    const [isSingInForm, setIsSingInForm] = useState(true)

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const singUpUser = async (e) => {
        e.preventDefault()
        setUser({email:'', password:''})
        try {
            await createUserWithEmailAndPassword(
                auth,
                user.email,
                user.password
            )
        } catch(error) {
            console.log(error.message)
        }
        // setLoading(false)
    }

    const singInUser = async (e) => {
        e.preventDefault()
        setUser({email:'', password:''})
        try {
            await signInWithEmailAndPassword(
                auth,
                user.email,
                user.password
            )
        } catch(error) {
            console.log(error.message)
        }
        // setLoading(false)
    }

    return (
        <div className='login__page row'>
            <div className='form__container'>
                <div className="row">
                    <span className={isSingInForm ? 'form__title form__title--active' : 'form__title'} onClick={() => setIsSingInForm(true)}>Sing In</span>
                    <span className={isSingInForm ? 'form__title' : 'form__title form__title--active'} onClick={() => setIsSingInForm(false)}>Sing Up</span>
                </div>
                {isSingInForm 
                ? <>
                    <form onSubmit={singInUser} method='POST'>
                        <label htmlFor="email" className='form__label'>User email</label>
                        <br/>
                        <input id="email" type="text" placeholder='email' name='email' value={user.email} onChange={handleChange} /> 
                        <br/>
                        <label htmlFor="password" className='form__label form__label--second'>password</label>
                        <br/>
                        <input id="password" type="password" placeholder='Password' name='password' value={user.password} onChange={handleChange} />
                        <br/>
                        <input type="submit" value='Sing In' className='form__btn btn btn--green'/>
                    </form>
                </>
                : <>
                    <form onSubmit={singUpUser} method='POST'>
                        <label htmlFor="email" className='form__label'>User email</label>
                        <br/>
                        <input id="email" type="text" placeholder='email' name='email' value={user.email} onChange={handleChange} /> 
                        <br/>
                        <label htmlFor="password" className='form__label form__label--second'>password</label>
                        <br/>
                        <input id="password" type="password" placeholder='Password' name='password' value={user.password} onChange={handleChange} />
                        <br/>
                        <input type="submit" value='Sing Up' className='form__btn btn btn--green'/>
                    </form>
                </>}
            </div>
        </div>
    )
}

export default LoginPage
