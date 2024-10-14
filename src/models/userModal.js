const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    telegramId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    refId: {
        type: String
    },
    referredById: {
      type: String,
      default: ''
    },
    walletAddress: {
        type: String,
        default:''
    },
    totalRewards: {
      type: Number,
      default: 1
    },
    referralRewards: {
        type: Number,
        default: 0
    },
    dailyLoginRewards:{
        type: Number,
        default: 1
    },
    games:{
        rockPaperScissors:{
            wins: {
                type: Number,
                default: 0,
            },
            losses: {
                type: Number,
                default: 0,
            },
        }
    },
    yourReferenceIds: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users',
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    userJoinedDate: { type: Date }, // Track the last login time
    lastLoginDate: { type: Date },
  });
  

const User = mongoose.model('User', userSchema)

module.exports = User
  