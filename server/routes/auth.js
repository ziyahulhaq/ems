const express = require ("express")
const { login, verify } = require("../controllers/authcontrollers.js")
const authMiddleware = require("../middleware/authMiddleware.js")

const router = express.Router()

router.post('/login' , login )
router.get('/verify' , authMiddleware  , verify)


module.exports = router        
