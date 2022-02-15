const express = require("express");
const bcrpt = require("bcrypt");
const User = require("./model");
const Connect = require("./Connectdb");
require("dotenv").config();
const app = express();
app.use(express.json());
const saltRound = 10;

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(400).json({ msg: "please provide Information" });
  }
  const Salt = await bcrpt.genSalt(saltRound);
  const HashedPassWord = await bcrpt.hash(password, Salt);
  const IsExist = await User.findOne({ email });
  if (IsExist) {
    res.status(400).json({ msg: "User allready exist with that email" });
  }
  try {
    const SaveUser = await User.create({
      username,
      email,
      password: HashedPassWord,
    });
    res.status(200).json({ msg: "Succsefully User Created", SaveUser });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server is up " });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    res.status(400).json({ msg: "please provide Information" });
  }
  const IsExist = await User.findOne({ email });
  console.log(IsExist);
  if (!IsExist) {
    res.status(400).json({ msg: "Please Register" });
  }
  const isPassword = await bcrpt.compare(password, IsExist.password);
  if (!IsExist) {
    res.status(400).json({ msg: "Email or password incorect ", IsExist });
  }
  res.status(200).json({ IsExist });
});

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
