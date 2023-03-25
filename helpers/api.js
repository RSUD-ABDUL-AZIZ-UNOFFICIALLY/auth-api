const axios = require("axios");
require("dotenv").config();
const baseURL = process.env.BASE_URL;
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const payload = {
  gid: "Server Side",
};

const seedwa = async function (telp, message) {
  var data = JSON.stringify({
    telp: telp,
    message: message,
  });
  let token = jwt.sign(payload, secretKey, { expiresIn: 60 });
  var config = {
    method: "post",
    url: `${baseURL}/api/wa/send`,
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer " + token,
    },
    data: data,
  };
  let response = await axios(config);
  return response.data;
  return JSON.stringify(response.data);
};
const urlwa = async function (telp) {
  var data = JSON.stringify({
    telp: telp,
  });
  let token = jwt.sign(payload, secretKey, { expiresIn: 60 });
  var config = {
    method: "get",
    url: `${baseURL}/api/wa/getProfilePic`,
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer " + token,
    },
    data: data,
  };

  let response = await axios(config);
  return JSON.stringify(response.data);
};

module.exports = {
  seedwa,
  urlwa,
};
