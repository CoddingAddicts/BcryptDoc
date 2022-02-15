const express = require("express");
const bcrpt = require("bcrypt");
const User = require("./model");
const Connect = require("./Connectdb");
require("dotenv").config();
const app = express();
//middleware to let express server send Json Type
app.use(express.json());
//This The saltRound by Default is 10 also the Salt should be in .env File
const saltRound = 10;

//The Register route
app.post("/register", async (req, res) => {
  //Deconstruct the Body sent Via This request
  const { username, password, email } = req.body;
  //Cheak if all the inforrmation is filled properlly
  if (!username || !password || !email) {
    res.status(400).json({ msg: "please provide Information" });
  }
  // Generate the Salt
  const Salt = await bcrpt.genSalt(saltRound);
  // Hash The password with Bcrypt
  const HashedPassWord = await bcrpt.hash(password, Salt);
  //check if the user already exit in our DB
  const IsExist = await User.findOne({ email });
  if (IsExist) {
    res.status(400).json({ msg: "User allready exist with that email" });
  }
  try {
    //This saves the user but make sure to save the Hashed PassWord
    const SaveUser = await User.create({
      username,
      email,
      password: HashedPassWord,
    });
    //Respond by a succsess msg and the User Object from Db
    res.status(200).json({ msg: "Succsefully User Created", SaveUser });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server is up " });
});

app.post("/login", async (req, res) => {
  //Deconstruct the request body
  const { email, password } = req.body;
  //Cheak if all the inforrmation is filled properlly
  if (!password || !email) {
    res.status(400).json({ msg: "please provide Information" });
  }
  //Lets check if the user Exists
  const IsExist = await User.findOne({ email });
  console.log(IsExist);

  if (!IsExist) {
    res.status(400).json({ msg: "Please Register" });
  }
  //Lets Compare The Passwords between the plain text that was sent
  //via the request Obj and the hashed password saved in DB
  //this will return a boolean True Or false
  const isPassword = await bcrpt.compare(password, IsExist.password);
  //if isPassword is incorect
  if (!isPassword) {
    res.status(400).json({ msg: "Email or password incorect ", IsExist });
  }
  //if the passwrod is correct
  res.status(200).json({ IsExist });
});

//This will wait till the server is connect to db and then start the server
const Start = async () => {
  try {
    Connect(process.env.URI);
    app.listen(3000, () => {
      console.log(`Server Is up on http://localhost:3000`);
    });
  } catch (err) {
    console.log(err);
  }
};

Start();
