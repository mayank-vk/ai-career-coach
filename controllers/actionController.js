const FormData = require('form-data')
const fs = require('fs')
const axios = require('axios')
const analysisModel=require('../models/Analysis')
const QAModel=require('../models/QAHistory')
const AnalysisModel = require('../models/Analysis')

const uploadControl = async (req,res) => {
    const form=new FormData()
    form.append('file',fs.createReadStream(req.file.path),req.file.originalname)
    form.append('user_id',req.userId)

    try{
        const flaskResponse=await axios.post('http://localhost:5000/upload',form,{
        headers:form.getHeaders()
        })
        const analysisDoc= new analysisModel({
            userId:req.userId,
            resumeText:flaskResponse.data.resume_text,
            analysisResult:flaskResponse.data.resume_analysis,
            fileName:req.file.originalname,

        })

        await analysisDoc.save()
        return res.status(200).json({success:true,message:analysisDoc.analysisResult})

    }catch(error){
        return res.status(500).json({error:'error processing uploaded file'})
    }

}


const askControl= async (req,res)=>{
    try{
        const params = new URLSearchParams();
        params.append('query',req.body.query)
        params.append('user_id',req.userId)
        const flaskResponse = await axios.post('http://localhost:5000/ask',params,{
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const qaDoc = new QAModel({
            userId: req.userId,
            analysisId:req.body.analysisId,
            question: flaskResponse.data.query,
            answer: flaskResponse.data.result
        })
        await qaDoc.save()
        return res.status(200).json({success:true,question:qaDoc.question,answer:qaDoc.answer})

    }catch(error){
        return res.status(400).json({error:error,message:'not able to proces request'})
    }


}


const historyControl = async (req,res)=>{
    try{
        const analyses = await analysisModel.find({userId:req.userId})
        const qaHistory = await QAModel.find({userId:req.userId})

        return res.status(200).json({analyses,qaHistory})

    }catch(error){
        return res.status(400).json({error:error,message:"user has no history"})
    }
}


module.exports={ uploadControl ,askControl, historyControl}