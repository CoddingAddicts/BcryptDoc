const mongoose = require("mongoose");

const ConnectDb = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = ConnectDb;
