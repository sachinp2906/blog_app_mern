const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userModel = require("../models/userModel");
const {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidString,
} = require("../validation/validation");

//************************************************User Create****************************************************************/
const userSignUp = async function (req, res) {
  let { name, title, email, password } = req.body;
  try {
    if ((!name, !title || !email || !password)) {
      return res
        .status(400)
        .send({ status: false, msg: "all fields are required" });
    }

    const CheckMail = await userModel.findOne({ email: email });
    if (CheckMail) {
      return res
        .status(400)
        .send({ status: false, msg: "mail already exist." });
    }

    if (!isValidPassword(password)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide a valid password." });
    }

    password = await bcrypt.hash(password, 10);

    const enumTitle = ["Mr", "Mrs", "Miss"];
    if (!enumTitle.includes(title)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please use 'Mr','Mrs','Miss' " });
    }

    // if (isValidString(name)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, msg: "Please provide a valid name." });
    // }

    if (!isValidEmail(email)) {
      return res.status(400).send({
        status: false,
        msg: "please provide valid mail",
      });
    } else {
      const data = await userModel.create({
        name,
        title,
        email,
        password,
      });
      return res
        .status(201)
        .send({ status: true, data: "data created succesfully", data });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//*************************************************sign in user************************************************************ */

const userSignIn = async function (req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: false, msg: "mail id or password is required" });
    }
    // if (!isValidEmail(email)) {
    //   return res.status(400).send({
    //     status: false,
    //     msg: "please provide valid mail",
    //   });
    // }
    // if (!isValidPassword(password)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, msg: "Please provide a valid password." });
    // }
    const userData = await userModel.findOne({ email: email });
    if (!userData) {
      return res.status(404).send({ status: false, msg: "email id not found" });
    }
    const comparePassword = await bcrypt.compare(password, userData.password);
    if (!comparePassword) {
      return res
        .status(400)
        .send({ status: false, msg: "password is incorrect" });
    }

    const token = jwt.sign(
      { userId: userData._id.toString() },
      "projectsecretcode"
    );
    const cookieData = res.cookie("token", token, { httpOnly: true });
    return res
      .status(200)
      .send({ status: true, msg: "succesfull logged in", token });
  } catch (error) {
    return res.status(500).send({ status: false, msg: "login failed" });
  }
};

//******************************************************exports********************************************************************** */
module.exports = { userSignUp, userSignIn };
