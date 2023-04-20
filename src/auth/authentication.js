const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const blogsModel = require("../models/blogModel");

//*************************************authentication******************************************** */


const authenticateUser = async function (req, res, next) {
  try {
    console.log(req.cookies);
    let token = req.cookies.token;
    if (!token) {
      return res.status(400).send({ status: false, msg: "token is required" });
    } else {
      jwt.verify(token, "projectsecretcode", function (err, decodeToken) {
        if (err) {
          return res.status(401).send({ status: false, msg: "token invalid" });
        } else {
          req.token = decodeToken;
          next();
        }
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: "authentication error" });
  }
};

//****************************************authorisation****************************************************** */


const authoriseUser = async function (req, res, next) {
  try {
    const blogId = req.params.blogId;
    if (!isValidObjectId(blogId)) {
      return res.status(400).send({ status: false, msg: "invalid blogId" });
    }
    const blogData = await blogsModel.findById(blogId);
    if (!blogData) {
      return res
        .status(400)
        .send({ status: false, msg: "Provide valid blogId" });
    }
    let authorId = blogData.userId;
    let authorIdFromDT = req.token.userId;
    if (authorId != authorIdFromDT) {
      return res.status(403).send({ status: false, msg: "not authorised" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  } 
};


module.exports = { authenticateUser, authoriseUser };
