const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

// get all events for a user
router.get('/:userId', async function(req, res, next) {
  const { userId } = req.params
  try {
    const user = await userController.getUser(userId)
    const events = user[0].events
    res.status(200).send({ events })
  } catch (e) {
    res.sendStatus(404)
  }
})

// add new event for a user
router.post('/:userId', async function(req, res, next) {
  const { userId } = req.params
  const { event } = req.body
  try {
    await userController.updateUserEvents(userId, event)
    res.sendStatus(200)
  } catch (e) {
    res.sendStatus(404)
  }
})

module.exports = router
