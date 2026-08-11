import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'



const Dashboard = () => {

  const [analyses,setAnalyses] = useState([])
  const [qaHistory,setQaHistory] = useState([])
  const [error,setError] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{
    const fetchHistory = async()=>{
      try{
        const response = await api.get('/action/history')
        setAnalyses(response.data.analyses)
        setQaHistory(response.data.qaHistory)
      }catch(e){
        setError(e.response.data.error)
      }
    }
    fetchHistory()
  },[])

  return (
    <div>
      <h2>Your resume history</h2>
      {error && <p style={{color:'red'}}>{error}</p>}

      {analyses.map((analysis)=>{
        return(
          <div className='analysisItem' key={analysis._id}>
            <p><strong>File:</strong>{analysis.fileName}</p>
            <p><strong>Analysis:</strong>{analysis.analysisResult}</p>
            <button type='button' onClick={()=>navigate(`/ask/${analysis._id}`)}>View Details</button>
          </div>
        )
      })}

      <h2>Past Questions</h2>

      {qaHistory.map((history)=>{
        return(
          <div className='historyItem' key={history._id}>
            <p><strong>Question:</strong>{history.question}</p>
            <p><strong>Answer:</strong>{history.answer}</p>
          </div>
        )
      })}
    </div>
  )
}

export default Dashboard
