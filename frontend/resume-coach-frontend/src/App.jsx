import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Ask from './pages/Ask'
import Upload from './pages/Upload'
import './App.css'



function App() {

  return (
    <Routes>
      {/*public routes*/}
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      {/*protected routes*/}

      <Route element={<ProtectedRoute/>}>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/ask/:analysisId' element={<Ask/>}/>
        <Route path='/upload' element={<Upload/>}/>
      </Route>

    </Routes>
  )
}

export default App
