import React from 'react'
import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const navigate=useNavigate()
    const { login, logout } = useAuth()
    const[error,setError] =  useState('')
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')


    const handleSubmit= async (e)=>{
        e.preventDefault()
        try{
            const response = await api.post('/auth/login',{email,password})
            const loginToken=response.data.token
            login(loginToken)
            navigate('/upload')
        }catch(e){
            setError(e.response.data.error)

        }
    }


  return (
    <div>
        <h2>Login</h2>
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
                <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}
                required
                />
            </div>
            {error && <p style={{color:'red'}}>{error}</p>}
            <button type='submit'>Login</button>
        </form> 
      
    </div>
  )
}

export default Login
