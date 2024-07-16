import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import  {registerValidation, loginValidation, postCreateValidation} from "./validation.js"
import checkAuth from './utils/checkAuth.js'

import { GetMe, Login, Register } from './controllers/UserController.js'
import { Create, GetAll, GetByTag, GetLastTags, GetOne, GetPopular, Remove, Update } from './controllers/PostController.js'
import handleValidationErrors from './utils/handleValidationErrors.js'
import { AddComment, GetComments } from './controllers/CommentController.js'

mongoose.connect("mongodb+srv://admin:wwwwww@cluster-mern-blog.drngv1j.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster-MERN-blog")
    .then(() => {
        console.log("DB Ok");
    })
    .catch((err) => {
        console.log("DB ERROR", err);
    })

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage})

app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use(cors())

app.post("/auth/login", loginValidation, handleValidationErrors, Login)
app.post('/auth/register', registerValidation, handleValidationErrors, Register)
app.get("/auth/me", checkAuth, GetMe)

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get("/posts", GetAll)
app.get("/posts/popular", GetPopular)
app.get("/tags", GetLastTags)
app.get("/tags/:tag", GetByTag)
app.get("/posts/:id", GetOne)
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, Create)
app.delete("/posts/:id", checkAuth, Remove)
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, Update)

app.get("/posts/:postId/comments", GetComments)
app.post("/posts/:postId/comments", checkAuth, AddComment)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('server ok');
})