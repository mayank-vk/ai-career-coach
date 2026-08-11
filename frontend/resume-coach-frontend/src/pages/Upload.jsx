import React, { useState } from 'react'
import api from '../api/axios'


const Upload = () => {
  const[file,setFile] = useState(null)
  const [analysis,setAnalysis] = useState('')
  const [error,setError] = useState('')


  const handleSubmit = async(e)=>{
    e.preventDefault()
    try{
      const response = await api.post('/action/upload',file,{
        headers:{
          'Content-Type':'multipart/form-data'
        }
      });
      setAnalysis(response.data.message)

    }catch(e){
      setError(e.response.data.error)

    }
  }

  const handleFileChange = (e)=>{

    const formData = new FormData()
    formData.append('file',e.target.files[0])
    setFile(formData)

  }



  return (
    <div>
      <h2>Upload Resume</h2>
      <form onSubmit={handleSubmit}>
        <input type='file' onChange={handleFileChange} accept='.pdf' required/>
        <button type='submit'>Upload</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      {analysis && <div>{analysis}</div>}
      
    </div>
  )
}

export default Upload
