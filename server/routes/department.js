const express = require ("express")
const authMiddleware = require("../middleware/authMiddleware.js")
const { addDepartment , getDepartments } = require("../controllers/departmentController.js")

const router = express.Router()

router.get('/' , authMiddleware , getDepartments)
router.post('/add' , authMiddleware , addDepartment)


module.exports = router
