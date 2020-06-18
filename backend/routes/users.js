var express = require('express')
var router = express.Router()
const axios = require('axios')
const querystring = require('querystring')
const userController = require('../controllers/user')
const env = require('dotenv').config().parsed

// get access token
router.get('/', function(req, res, next) {
  const { code } = req.query
  axios
    .post(
      'https://api.line.me/oauth2/v2.1/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: env.F2E_URL,
        client_id: '1654358305',
        client_secret: 'ed4b0eae144af0b29c0040eef5dace48'
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    )
    .then(response => {
      // access token, refresh token
      const { access_token, refresh_token } = response.data
      res.status(200).send({ access_token, refresh_token })
    })
    .catch(() => res.sendStatus(500))
})

// verify access token (login)
router.post('/verify', function(req, res) {
  const { accessToken, refreshToken } = req.body
  axios
    .get('https://api.line.me/oauth2/v2.1/verify/', {
      params: { access_token: accessToken }
    })
    .then(() => {
      // get user profile
      return axios.get('https://api.line.me/v2/profile', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    })
    .then(response => {
      // display name & user id
      // login success
      const { displayName, userId } = response.data
      userController
        .getUser(userId)
        .then(user => {
          if (user.length) return user[0]
          return userController.addUser(userId, refreshToken)
        })
        .then(user => {
          return user.save()
        })
        .then(res.status(200).send({ accessToken, displayName, userId }))
        .catch(() => res.sendStatus(500))
    })
    .catch(() => {
      // use refresh token to get new access token
      axios
        .post(
          'https://api.line.me/oauth2/v2.1/token',
          querystring.stringify({
            grant_type: 'refresh_token',
            client_id: '1654358305',
            client_secret: 'ed4b0eae144af0b29c0040eef5dace48',
            refresh_token: refreshToken
          })
        )
        .then(response => {
          const { access_token: accessToken } = response.data
          res.status(401).send({ accessToken })
        })
        .catch(() => {
          // need new refresh token
          res.sendStatus(400)
        })
    })
})

// logout
router.post('/revoke', function(req, res) {
  const { accessToken } = req.body
  axios
    .post(
      'https://api.line.me/oauth2/v2.1/revoke',
      querystring.stringify({
        access_token: accessToken,
        client_id: '1654358305',
        client_secret: 'ed4b0eae144af0b29c0040eef5dace48'
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    )
    .then(response => {
      // logout success
      console.log(response)
      res.sendStatus(200)
    })
    .catch(() => res.sendStatus(500))
})

module.exports = router
