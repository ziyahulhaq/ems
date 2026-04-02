const express = require ("express")
const authMiddleware = require("../middleware/authMiddleware.js")
const {
  addDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController.js")

const router = express.Router()

router.get('/' , authMiddleware , getDepartments)
router.post('/add' , authMiddleware , addDepartment)
router.get('/:id' , authMiddleware , getDepartmentById)
router.put('/:id' , authMiddleware , updateDepartment)
router.delete('/:id' , authMiddleware , deleteDepartment)


module.exports = router
