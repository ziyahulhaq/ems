const express = require ("express")
const authMiddleware = require("../middleware/authMiddleware.js")
const authorizeRoles = require("../middleware/authorizeRoles.js")
const {
  addDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController.js")

const router = express.Router()

router.get('/' , authMiddleware , getDepartments)
router.post('/add' , authMiddleware , authorizeRoles("admin"), addDepartment)
router.get('/:id' , authMiddleware , getDepartmentById)
router.put('/:id' , authMiddleware , authorizeRoles("admin"), updateDepartment)
router.delete('/:id' , authMiddleware , authorizeRoles("admin"), deleteDepartment)


module.exports = router
