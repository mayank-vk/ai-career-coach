import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'

const Ask = () => {

  const { analysisId } = useParams()

  const [query,setQuery] = useState('')
  const[error,setError] = useState('')
  const[answer,setAnswer] = useState('')


  const handleSubmit = async (e)=>{
    e.preventDefault()
    try{
      const response = await api.post('/action/ask',{query,analysisId})
      setAnswer(response.data.answer)

    }catch(e){
      setError(e.response.data.error)
    }

  }



  return (
    <div>
      <h2>Ask About Your Resume</h2>
      <form onSubmit={handleSubmit}>
        <input type='text' value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Ask a question about your resume" required/>
        <button type='submit'>Ask</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      {answer && (
        <div>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
      
    </div>
  )
}

export default Ask
