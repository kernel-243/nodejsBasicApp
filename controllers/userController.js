const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

 
 
// get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  return res.json({ data: users });
});

// add user
exports.createUser = asyncHandler(async (req, res) => {
  console.log(req.body);

  //check if email exist
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.json({ message: "User already exist", status: "error" });
  }
  if (req.file) {
    user.profile = req.file.destination + req.file.filename;
  }
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err)
      return res.json({
        message: "Error hashing password",
        status: "error",
        err: err,
      });

    req.body.password = hashedPassword;
    const newUser = new User(req.body);

    await newUser.save();

    if (req.body.setPassword == false) {
      const message =
        "Bienvenue " +
        req.body.firstName +
        " " +
        req.body.lastName +
        " sur la plateforme Qavah group\nVous avez été ajouté sur la plateforme en tant que " +
        req.body.role +
        " avec votre adresse mail " +
        req.body.email +
        "\nVeuillez mettre à jour votre mot de passe en cliquant sur ce lien http://localhost:4200/auth/reset-password/" +
        newUser._id;
      sendTextMessage(req.body.phone, message);
    }

    return res.status(201).json({ message: "User added", status: "success" });
  });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { indicatif, telephone, password } = req.body;
  console.log("INDICATIFffffffff ", indicatif);
  console.log("TELEPHONE ", telephone);
  console.log("PASSWORD ",password); 
//search user where indicatif and telephone match
 try{
  const user = await User.findOne({ indicatif, telephone });
  
  console.log("USER ",user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  console.log("USERRRKKKKK ",user);

  const match = await bcrypt.compare(password, user.password);
  console.log("MATCH ",match);
  if (!match) {
    return res.json({ message: "Incorrect password", status: "failed" });
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  //remove _id and password from user object
  // user._id=null;
  user.password = null;
  let agent = null;
  //if role is agent find it
  if (user.role == "Agent") {
    console.log("Agent");
    agent = await Agent.findOne({ user: user._id });
  }

  // console.log(user);

  res
    .status(200)
    .json({
      token: token,
      message: "Login success",
      status: "success",
      data: { ...user._doc, agent: agent },
    });
 }catch(err){
   console.log(err);
   return res.status(400).json({ message: "Error", status: "failed" });
 }
});

 
