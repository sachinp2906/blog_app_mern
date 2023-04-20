const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const {isValidString} = require('../validation/validation')
//*********************************************create blog***************************************************** */
const createBlog = async function (req, res) {
  const { title, body } = req.body;
  let userId = req.token.userId;
  try {
    if (!title || !body) {
      return res
        .status(400)
        .send({ status: false, msg: "all fields are required" });
    }
  
    if (!isValidString(title)) {
      return res.status(400).send({
        status: false,
        msg: "title is invalid! (please take title in string)",
      });
    }
    // body validation
    if (!isValidString(body)) {
      return res.status(400).send({
        status: false,
        msg: "body is invalid! (please take body in string)",
      });
    }
    const userDetail = await userModel.findById(userId);
    if (!userDetail) {
      return res.status(400).send({ status: false, msg: "user not found" });
    }

    const data = await blogModel.create({
      title,
      body,
      userId,
    });
    return res
      .status(201)
      .send({ status: true, data: "succesfully created blog data", data });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//*******************************************get blogs************************************************* */

const getBlogs = async function (req, res) {
  try {
    const blogs = await blogModel.find({ isDeleted: false });
    if (blogs.length === 0) {
      return res
        .status(404)
        .send({ status: false, message: "no data in blog" });
    }
    return res.status(200).send({ status: true, data: blogs });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "internal server error" });
  }
};

//************************************************update blog*********************************************** */
const updateBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;

    if (!blogId) {
      return res.status(400).send({ status: false, msg: "BlogId is required" });
    }

    const blogDetails = await blogModel.findById(blogId);

    if (!blogDetails) {
      return res
        .status(404)
        .send({ status: false, msg: "blogDetails not found" });
    }
    if (blogDetails._id != blogId) {
      return res
        .status(404)
        .send({ status: false, msg: "blogDetails not found" });
    }

    if (blogDetails.isDeleted == true) {
      return res
        .status(404)
        .send({ status: false, msg: "blog details is deleted" });
    }
    const updateData = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      {
        $set: {
          title: req.body.title,
          body: req.body.body,
        },
      },
      { new: true, upsert: true }
    );
    return res.status(200).send({
      status: true,
      msg: "data succesfully created",
      data: updateData,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//***********************************************delete blog********************************************************** */
const deleteBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    // checking blogId is coming or not
    if (!blogId) {
      return res
        .status(400)
        .send({ status: false, msg: "blogId is required." });
    }

    const blogDetails = await blogModel.findById(blogId);

    if (!blogDetails) {
      return res.status(404).send({ status: false, msg: "No data found!" });
    }

    if (blogDetails._id != blogId) {
      return res
        .status(404)
        .send({ status: false, msg: "blogDetail is not present" });
    }

    if (blogDetails.isDeleted == true) {
      return res
        .status(404)
        .send({ status: false, msg: "blogDetails is already deleted" });
    }

    const deleteData = await blogModel.updateOne(
      { _id: blogId },
      { $set: { isDeleted: true } },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, msg: "data deleted succesfully" });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//*********************************************exports***************************************************** */
module.exports = { createBlog, getBlogs, updateBlog , deleteBlog};
