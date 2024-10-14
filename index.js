// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api')
const logger = require('./src/helpers/logger') // Import the custom logger
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


//Telegram bot
const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token)
bot.onText(/\/start(?:\s+(\w+))?/, (msg, match) => {
    const chatId = msg.chat.id
    const referredId = match[1]
    logger.info(`Received /start command with referredId: ${referredId}`)
    bot.sendMessage(chatId, 'Welcome! Open the web app to see your details:', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Open WebApp',
              web_app: {
                url: `https://app.thememe.tv/?start=${referredId}`
              }
            }
          ]
        ]
      }
    })
  })

// Connect to MongoDB
mongoose
    .connect(process.env.DBURL, {
      maxPoolSize: 10, // Set maxPoolSize instead of poolSize
      serverSelectionTimeoutMS: 5000 // Keep trying to send operations for 5 seconds
    })
    .then(() => {
      logger.info(
        '*********🛡️ 🔍  Successfully Connected to MongoDB 🛡️ 🔍 **********'
      )
    })
    .catch(err => {
      logger.error('MongoDB Connection Failure', err)
    })

//router which contains all api
const router = require('./src/routes/allRoutes')
app.use(router)
  
app.get('/', (req, res) => {
  res.send(' ***🔥🔥 WWT Backend Server is Running 🔥🔥*** ')
})

// Start the server
app.listen(PORT, () => {
  console.log(`WWT Server running on port ${PORT}`);
});
