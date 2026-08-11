const { Schema,model } = require('mongoose')

const QASchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true,


    },
    analysisId:{
        type: Schema.Types.ObjectId,
        ref:'Analysis',
        required: true,
    },
    question:{
        type: String,
        required: true,
    },
    answer:{
        type: String,
        required: true,
    }

},{ timestamps: true })

const QAModel = model('QA',QASchema)

module.exports = QAModel