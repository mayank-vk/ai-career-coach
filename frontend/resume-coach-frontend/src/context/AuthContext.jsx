import React from 'react'
import { createContext, useContext,useState } from 'react'
import { useEffect } from 'react'
const AuthContext = createContext()


export const AuthProvider= ({children})=>{

    const [token,setToken] = useState(null)

    useEffect(()=>{
        if(localStorage.getItem('token')!==null){
            setToken(localStorage.getItem('token'))
        }
    },[])

    const login = (newToken)=>{
        setToken(newToken)
        localStorage.setItem('token',newToken)
    }

    const logout = ()=>{
        setToken(null)
        localStorage.removeItem('token')
    }

    return(
        <AuthContext.Provider value={{ token,login,logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth=()=>useContext(AuthContext)
