import express from 'express'
import cors from 'cors'
import { initializeAdmin, initializeDataFile } from './file.js'
import {config as envConfig} from 'dotenv'
import { adminLogin, getAllUser} from './controller.js'
import adminRouter from './adminRoutes.js'
import { checkIsAdmin } from './authMiddleware.js'

envConfig()

initializeDataFile()
initializeAdmin()

const app=express()
const PORT=process.env.PORT



app.use(cors())

app.use(express.json())


app.use((req,_,next)=>{
    const reqUrl=req.url
    const method=req.method
    console.log(`Request @ ${reqUrl} METHOD:${method}`)
    next()
})

// ADMIN / USER LOGIN
app.post('/api/login', adminLogin)
// GET ALL USER DETAILS 
app.get('/api/users' ,checkIsAdmin,getAllUser)
// UPDATED AND DELETE THE SPECIFIC USER 
app.use('/api/user',checkIsAdmin,adminRouter)



app.use((req,res)=>{
    return res.json({
        message:"route not found"
    })
})


app.listen(PORT,()=>{
    console.log(`Server running @ PORT:${PORT}`);
    
})
