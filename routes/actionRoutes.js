const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const verifyMiddleware = require('../middleware/authMiddleware')
const { uploadControl, askControl, historyControl } = require('../controllers/actionController')

router.post('/upload',verifyMiddleware,upload.single('file'),uploadControl)
router.post('/ask',verifyMiddleware,askControl)
router.get('/history',verifyMiddleware,historyControl)



module.exports=router