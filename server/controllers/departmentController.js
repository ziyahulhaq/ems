const Department = require("../models/Departmnet");
const getDepartments = async (req , res) => {
try{
  const departments = await Department.find()
  return res.status(200).json({success : true , departments })
}catch(error){
  return res.status(500).json ({success : false , error : "get department server error"})
}
}

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;

    if (!dep_name) {
      return res.status(400).json({
        success: false,
        error: "Department name is required",
      });
    }

    const newDep = new Department({
      dep_name,
      description,
    });
    await newDep.save();
    return res.status(200).json({ success: true, department: newDep });
  } catch (error) {
    console.error("Add Department Error:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: error.message || "Add Department Server Error",
      });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Get Department Server Error",
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;

    if (!dep_name) {
      return res.status(400).json({
        success: false,
        error: "Department name is required",
      });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        dep_name,
        description,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true },
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Update Department Server Error",
    });
  }
};

module.exports = {
  addDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
};
