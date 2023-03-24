'use strict';
const { User, Session, Previlage, Level, Token } = require('../models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { Op } = require("sequelize");
const { acctoken } = require('../helpers/jwt');
const { use } = require('bcrypt/promises');
const { seedwa, urlwa } = require('../helpers/api');
const helpers = require('../helpers');

module.exports = {
    register: async (req, res) => {
        try {
            const { username, fullname, email, nohp, password, lvid, token } = req.body;
            if (helpers.validEmail(email) == false) {
                return res.status(400).json({
                    status: false,
                    message: 'email is not valid',
                    data: null
                });
            }
            const isExist = await User.findOne({ where: { [Op.or]: [{ email: email }, { username: username }, { nohp: nohp }] } });
            console.log(isExist);
            if (isExist) {
                return res.status(400).json({
                    status: false,
                    message: 'user already exist!',
                    data: null
                });
            }
            const cekToken = await Token.findOne({ where: { [Op.and]: [{ telp: nohp }, { token: token }] } });
            if (!cekToken) {
                return res.status(400).json({
                    status: false,
                    message: 'token not found',
                    data: null
                });
            }
            const isExpired = cekToken.exp < new Date();
            if (isExpired) {
                return res.status(400).json({
                    status: false,
                    message: 'token expired',
                    data: null
                });
            }
            // console.log(lvid.length)
            const hashPassword = await bcrypt.hash(password, 10);
            const gid = uuid.v4();
            const pic = await urlwa(`0${nohp}`);
            // get data pic
            console.log( JSON.parse(pic).data);
            const newUser = await User.create({
                gid: gid,
                username: username,
                nohp: nohp,
                fullname: fullname,
                email: email,
                password: hashPassword,
                pic: JSON.parse(pic).data,
            });

            lvid.forEach(element => {
                Previlage.create({
                    gid: gid,
                    lvid: element,
                })
            })

            res.status(201).json({
                status: true,
                message: 'user registered',
                data: {
                    gid: newUser.gid,
                    name: newUser.name,
                    email: newUser.email,
                    updatedAt: newUser.updatedAt,
                    createdAt: newUser.createdAt,
                }
            });

        } catch (err) {
            res.status(500).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },

    login: async (req, res) => {
        try {
            const user = await User.authenticate(req.body);
            // console.log(user);
            const refreshToken = user.generateRefreshToken();
            const users = await User.findAll({
                where: { gid: user.gid },
                attributes: ['gid', 'username', 'fullname', 'email', 'pic'],
                include: [
                    {
                        model: Previlage,
                        as: 'kd_access',
                        attributes: ['lvid'],
                        include: [
                            {
                                model: Level,
                                as: 'Level',
                                attributes: ['access']
                            },
                        ]
                    },

                ]
            });
            const accesstoken = users[0].generateToken();
            if (req.headers['x-real-ip'] == undefined) {
                req.headers['x-real-ip'] = req.connection.remoteAddress;
            }
            await Session.create({
                name: user.gid,
                status: 'login',
                user_agent: req.headers['user-agent'],
                host: req.headers['host'],
                remoteAddress: req.headers['x-real-ip'],
                refresh: refreshToken,
                access: accesstoken,
            });

            res.status(200).json({
                status: true,
                message: 'success login',
                data: {
                    user: users,
                    access_token: accesstoken,
                    refresh_token: refreshToken,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt,
                }
            });
        } catch (err) {
            // console.log(err);
            res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    refresh: async (req, res) => {
        try {
            const session = await Session.valid(req.body);
            const user = await User.findOne({ where: { gid: session.name } });

            const users = await User.findAll({
                where: { gid: user.gid },
                attributes: ['gid', 'username', 'fullname', 'email', 'pic'],
                include: [
                    {
                        model: Previlage,
                        as: 'kd_access',
                        attributes: ['lvid'],
                        include: [
                            {
                                model: Level,
                                as: 'Level',
                                attributes: ['access']
                            },
                        ]
                    },

                ]
            });
            const accesstoken = users[0].generateToken();
          
            if (req.headers['x-real-ip'] == undefined) {
                req.headers['x-real-ip'] = req.connection.remoteAddress;
            }
            await Session.update({
                status: 'refresh',
                remoteAddress: req.headers['x-real-ip'],
                access: accesstoken

            }, {
                where: {
                    refresh: req.body.refresh_token
                }
            });

            res.status(200).json({
                status: true,
                message: 'success refresh access token',
                data: {
                    access_token: accesstoken,

                }
            });
        } catch (err) {
            res.status(401).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    token: async (req, res) => {
        try {
            if (req.body.telp == undefined) {
                return res.status(400).json({
                    status: false,
                    message: 'telp is required',
                    data: null
                });
            }
            let noTelp = typeof (req.body.telp);
            if (noTelp != 'number') {
                return res.status(400).json({
                    status: false,
                    message: 'telp must be number',
                    data: null
                });
            }
            // random number
            const random = Math.floor(10000 + Math.random() * 90000);
            let pesan = await seedwa(`0${req.body.telp}`, "Kode OTP anda adalah " + random);
            // datetime + 10 menit
            let expired = new Date();
            expired.setMinutes(expired.getMinutes() + 10);
            console.log(expired);
            const isExist = await Token.findOne({ where: { telp: `0${req.body.telp}` } });
            if (isExist) {

                await Token.update({
                    token: random,
                    exp: expired
                }, {
                    where: {
                        telp: `0${req.body.telp}`
                    }
                });
            } else {
                await Token.create({
                    telp: `0${req.body.telp}`,
                    token: random,
                    exp: expired
                });
            }
            return res.status(200).json({
                status: true,
                message: 'success send otp',
                data: `0${req.body.telp}`,
            });


        } catch (err) {
            res.status(401).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    level: async (req, res) => {
        try {
            const level = await Level.findAll({
                attributes: ['id', 'access'],
            });
            res.status(200).json({
                status: true,
                message: 'success get level',
                data: level,
            });
        } catch (err) {
            res.status(401).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    forgot: async (req, res) => {
        try {
            const token = await Token.findOne({ where: { [Op.and]: [{telp: req.body.nohp },{token:req.body.token}] }});
            if (!token) {
                return res.status(400).json({
                    status: false,
                    message: 'token not found',
                    data: null
                });
            }
            if (token.exp < new Date()) {
                return res.status(400).json({
                    status: false,
                    message: 'token expired',
                    data: null
                });
            }
            const user = await User.findOne({ where: { nohp: req.body.nohp } });
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'email not found',
                    data: null
                });
            }
            const password = await bcrypt.hash(req.body.new_password, 10);
            await User.update({
                password: password
            }, {
                where: {
                    nohp: req.body.nohp
                }
            });
            res.status(200).json({
                status: true,
                message: 'success update password',
                data: null,
            });
        } catch (err) {
            res.status(401).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },

};
