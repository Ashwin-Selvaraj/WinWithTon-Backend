const User = require('../models/userModal');
const logger = require('../helpers/logger');

// Function to generate a 5-character alphanumeric identifier
const generateRefId = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}

const login = async (req, res, next) => {
  let { name, referredById, telegramId } = req.body
  try {
    name = name.trim()
    telegramId = telegramId.trim()
    const refId = generateRefId() // Implement this function to generate a refId
    let user = await User.findOne({ telegramId })
    const currentDate = new Date()
    const currentDay = currentDate.getUTCDate()
    const currentMonth = currentDate.getUTCMonth()
    const currentYear = currentDate.getUTCFullYear()  

    let referringUser = null
    if (referredById) {
      referringUser = await User.findOne({ refId: referredById })
      if (!referringUser) {
        referredById = '' // Set to null if referring user not found
        console.error('Referring user not found')
      }
    }
    //creating a new user
    if (!user) {
      user = new User({
        telegramId,
        name,
        refId,
        referredById,
        totalRewards: 1,
        referralRewards: 0,
        dailyLoginRewards: 1,
        userJoinedDate: currentDate,
        lastLoginDate: currentDate
      })
      await user.save()

      // If there's a referring user, calculate their rewards
      if (referringUser) {
        referringUser.yourReferenceIds.push({ userId: user._id })

        // Add base referral reward for each referral
        referringUser.totalRewards += 5
        referringUser.referralRewards += 5
        await referringUser.save()
      }
    } else {
      // Existing user login
      const lastLoginDate = new Date(user.lastLogin)
      const lastLoginDay = lastLoginDate.getUTCDate()
      const lastLoginMonth = lastLoginDate.getUTCMonth()
      const lastLoginYear = lastLoginDate.getUTCFullYear()

      if (
        currentYear > lastLoginYear ||
        currentMonth > lastLoginMonth ||
        currentDay > lastLoginDay
      ) {
        user.dailyLoginRewards+=1;
      }
      user.lastLogin = currentDate
      await user.save()
    }
    res.status(201).json({
      message: `User logged in successfully`,
      user
    })
  } catch (err) {
    next(err)
  }
}

const userDetails = async (req, res, next) => {
  try {
    let { telegramId } = req.params

    // Trim leading and trailing spaces
    telegramId = telegramId.trim()

    logger.info(
      `Received request for user details with telegramId: ${telegramId}`
    )

    // Find the user detail document for the given telegramId
    const userDetail = await User.findOne({ telegramId: telegramId })

    // Check if user detail was found
    if (!userDetail) {
      logger.warn(`User not found for telegramId: ${telegramId}`)
      return res.status(404).json({ message: 'User not found' })
    }

    logger.info(
      `User details retrieved successfully for telegramId: ${telegramId}`
    )

    // Add the currentPhase to the user details
    const response = {
      ...userDetail._doc, // Spread the user detail fields
    }
    // Return the user details with the current phase in the response
    return res.status(200).json(response)
  } catch (err) {
    logger.error(`Error during login process: ${err.message}`)
    next(err)
  }
}


module.exports = {
  login,
  userDetails
}
