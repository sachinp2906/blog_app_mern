const express = require('express')
const router = express.Router()
const {userSignUp , userSignIn} = require('../controller/user')
const {authenticateUser , authoriseUser} = require('../auth/authentication')
const {createBlog , getBlogs , updateBlog , deleteBlog} = require('../controller/blog')

//***user routes***/
router.post('/signup' , userSignUp)
router.post('/signin' , userSignIn)

//***blog routes***/
router.post('/blog/create' , authenticateUser , createBlog)
router.get('/blog/all' , getBlogs)
router.put('/blog/update/:blogId' , authenticateUser , authoriseUser , updateBlog)
router.put('/blog/delete/:blogId' , authenticateUser , authoriseUser , deleteBlog)

module.exports = router