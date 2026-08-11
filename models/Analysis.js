const {Schema,model}=require('mongoose')


const analysisSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    resumeText:{
        type: String,
        required:true,

    },
    analysisResult:{
        type:String,
        required:true,
    },
    fileName:{
        type:String,
    },
},{ timestamps: true});

const AnalysisModel=model("Analysis",analysisSchema);

module.exports=AnalysisModel