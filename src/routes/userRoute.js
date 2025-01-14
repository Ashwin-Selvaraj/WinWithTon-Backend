const express = require('express')
const router = express.Router()
const { celebrate, Joi, errors, Segments } = require('celebrate')
const {
  login,
  userDetails,
} = require('../controllers/userController')

router.post(
  '/login',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      referredById: Joi.string().optional(),
      telegramId: Joi.string().required()
    })
  }),
  login
)

router.get(
  '/userDetails/:telegramId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      telegramId: Joi.string().required()
    })
  }),
  userDetails
)

router.use(errors())

module.exports = router
