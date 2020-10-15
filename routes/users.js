var express = require('express');
var router = express.Router();
var models = require('../models/index');
var jwt = require('jsonwebtoken');

// Signup
router.post('/signup', async function(req, res, next) {
    try {
        const {name, email, password} = req.body;
        // check email available
        const check = await models.users.findAll({
            where: {
                email: email
            }
        });
        // email is already taken
        if(check.length !== 0){
            res.status(400).json({
                'status': 'ERROR',
                'messages': 'Email is already taken!'
            })
        } 

        const user = await models.users.create({
            name,
            email,
            password
        });

        if(user) {
            res.status(201).json({
                'status': 'OK',
                'messages': 'User has been created successfully!',
                'data': user
            })
        }
    } catch (error) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': error.message
        })
    }
});

// Signin
router.post('/signin', async function(req, res, next) {
    try {
        const {email, password} = req.body;

        const checkEmail = await models.users.findAll({
            where: {
                email: email
            }
        })

        if(checkEmail.length == 0){
            res.status(404).json({
                'status': 'NOT_FOUND',
                'messages': 'Email not found!'
            })
        } else {
          if(checkEmail[0].password != password){
              res.status(400).json({
                  'status': 'ERROR',
                  'messages': 'Wrong Password!'
              })
          } else {
            var token = jwt.sign({username: email}, 'secretkey', (err, token) => {
              res.json({
                'status': 'OK',
                'messages': 'Login Success!',
                'accessToken': token
              })
          })
          }
        }
    } catch (error) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': error.message
        })
    }
});

module.exports = router;
