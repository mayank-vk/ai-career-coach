const express = require('express')
const authRouter = require('./routes/authRoutes')
const actionRouter = require('./routes/actionRoutes')
const app = express()
const cors = require('cors')
const connectDB = require('./config/db')
const PORT=3000

connectDB();
app.use(cors({origin:'http://localhost:5173'}))//allows requests from our react frontend
app.use(express.json())//inbuilt middleware


//auth routes
app.use('/auth',authRouter)
app.use('/action',actionRouter)





app.listen(PORT,()=>{
    console.log(`app successfully listening on port ${PORT}`)
})
