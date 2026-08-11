import axios from 'axios'
import React from 'react'
import api from '../api/axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {

    const [email,setEmail] = useState('')
    const [password,setPssword] = useState('')
    const[error,setError] = useState('')
    const navigate = useNavigate()


    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            await api.post('/auth/signup',{email,password})
            navigate('/login')
        }catch(e){
            setError(e.response.data.error)
        }
    }
  return (
    <div>
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email</label>
                <input 
                type="email" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                required
                />
            </div>
            <div>
                <label>Password</label>
                <input type='password' value={password} onChange={(e)=>setPssword(e.target.value)}
                required
                />
            </div>
            {error && <p style={{color:'red'}}>{error}</p>}
            <button type='submit'>Sign up</button>
        </form>      
    </div>
  )
}

export default Signup
