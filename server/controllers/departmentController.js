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

module.exports = { addDepartment, getDepartments };
