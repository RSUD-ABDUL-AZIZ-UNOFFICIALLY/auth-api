const axios = require('axios');
require('dotenv').config();
const baseURL = process.env.BASE_URL;

const seedwa =  async function (telp, message) {

    var data = JSON.stringify({
        "telp": telp,
        "message": message
    });
    var config = {
        method: 'post',
        url: `${baseURL}/api/wa/send`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    let response = await axios(config)
    return JSON.stringify(response.data);
}
const urlwa = async function (telp) {
    var data = JSON.stringify({
        "telp": telp
    });
    var config = {
        method: 'get',
        url: `${baseURL}/api/wa/getProfilePic`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };

    let response = await axios(config)
    return JSON.stringify(response.data);
    }


module.exports = {
    seedwa,
    urlwa
}