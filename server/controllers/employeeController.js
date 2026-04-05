const Employee = require("../models/Employee");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      $or: [{ role: { $exists: false } }, { role: { $ne: "admin" } }],
    }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Get employee server error",
    });
  }
};

const addEmployee = async (req, res) => {
  try {
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const confirmPassword =
      typeof req.body.confirmPassword === "string" ? req.body.confirmPassword : "";
    const employeeId = req.body.employeeId?.trim();
    const designation = req.body.designation?.trim();
    const role = req.body.role?.trim().toLowerCase();
    const rawSalary =
      typeof req.body.salary === "string" ? req.body.salary.trim() : req.body.salary;
    const parsedSalary = Number(rawSalary);
    const parsedDateOfBirth = normalizeDate(req.body.dateOfBirth);
    const payload = {
      name: req.body.name?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      employeeId: employeeId || undefined,
      dateOfBirth: parsedDateOfBirth,
      gender: req.body.gender?.trim().toLowerCase(),
      maritalStatus: req.body.maritalStatus?.trim().toLowerCase(),
      designation,
      department: req.body.department?.trim(),
      role,
      salary: parsedSalary,
      profileImage: req.body.profileImage?.trim() || "",
      notes: req.body.notes?.trim() || "",
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.gender ||
      !payload.maritalStatus ||
      !payload.designation ||
      !payload.department ||
      !payload.role ||
      !password ||
      !confirmPassword ||
      !req.body.dateOfBirth ||
      rawSalary === "" ||
      Number.isNaN(parsedSalary)
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Name, email, date of birth, gender, marital status, designation, department, role, salary, and password are required",
      });
    }

    if (!["male", "female", "other"].includes(payload.gender)) {
      return res.status(400).json({
        success: false,
        error: "Gender must be male, female, or other",
      });
    }

    if (!["single", "married", "divorced", "widowed"].includes(payload.maritalStatus)) {
      return res.status(400).json({
        success: false,
        error: "Invalid marital status",
      });
    }

    if (!["admin", "employee"].includes(payload.role)) {
      return res.status(400).json({
        success: false,
        error: "Role must be admin or employee",
      });
    }

    if (!parsedDateOfBirth || Number.isNaN(parsedDateOfBirth.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid date of birth",
      });
    }

    if (!Number.isFinite(parsedSalary) || parsedSalary < 0) {
      return res.status(400).json({
        success: false,
        error: "Salary must be a valid positive number",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Password and confirm password do not match",
      });
    }

    const existingEmployee = await Employee.findOne(
      employeeId
        ? { $or: [{ email: payload.email }, { employeeId }] }
        : { email: payload.email },
    );
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        error:
          existingEmployee.email === payload.email
            ? "Employee email already exists"
            : "Employee ID already exists",
      });
    }

    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "A login account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
      profileImage: payload.profileImage,
    });

    let employee;

    try {
      employee = await Employee.create(payload);
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }

    return res.status(201).json({ success: true, employee });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Employee already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Add employee server error",
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    const previousEmail = employee?.email;

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    const nextEmail = req.body.email?.trim()?.toLowerCase();
    const nextEmployeeId = req.body.employeeId?.trim();
    const nextDateOfBirth = req.body.dateOfBirth ? normalizeDate(req.body.dateOfBirth) : undefined;
    const nextSalary =
      req.body.salary === undefined || req.body.salary === null || req.body.salary === ""
        ? undefined
        : Number(req.body.salary);
    const nextStatus = req.body.status?.trim().toLowerCase();

    if (req.body.email !== undefined && !nextEmail) {
      return res.status(400).json({
        success: false,
        error: "Email cannot be empty",
      });
    }

    if (req.body.employeeId !== undefined && !nextEmployeeId) {
      return res.status(400).json({
        success: false,
        error: "Employee ID cannot be empty",
      });
    }

    if (req.body.dateOfBirth !== undefined && !nextDateOfBirth) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid date of birth",
      });
    }

    if (req.body.salary !== undefined && (!Number.isFinite(nextSalary) || nextSalary < 0)) {
      return res.status(400).json({
        success: false,
        error: "Salary must be a valid positive number",
      });
    }

    if (req.body.status !== undefined && !["active", "hold"].includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        error: "Status must be active or hold",
      });
    }

    if (nextEmail && nextEmail !== employee.email) {
      const duplicateEmployee = await Employee.findOne({
        email: nextEmail,
        _id: { $ne: employee._id },
      });

      if (duplicateEmployee) {
        return res.status(400).json({
          success: false,
          error: "Employee email already exists",
        });
      }

      const duplicateUser = await User.findOne({ email: nextEmail });

      if (duplicateUser && duplicateUser.email !== previousEmail) {
        return res.status(400).json({
          success: false,
          error: "A login account with this email already exists",
        });
      }
    }

    if (nextEmployeeId && nextEmployeeId !== employee.employeeId) {
      const duplicateId = await Employee.findOne({
        employeeId: nextEmployeeId,
        _id: { $ne: employee._id },
      });

      if (duplicateId) {
        return res.status(400).json({
          success: false,
          error: "Employee ID already exists",
        });
      }
    }

    if (req.body.name !== undefined) {
      employee.name = req.body.name?.trim() || employee.name;
    }

    if (nextEmail) {
      employee.email = nextEmail;
    }

    if (nextEmployeeId) {
      employee.employeeId = nextEmployeeId;
    }

    if (nextDateOfBirth) {
      employee.dateOfBirth = nextDateOfBirth;
    }

    if (req.body.designation !== undefined) {
      employee.designation = req.body.designation?.trim() || "";
    }

    if (req.body.department !== undefined) {
      employee.department = req.body.department?.trim() || employee.department;
    }

    if (nextSalary !== undefined) {
      employee.salary = nextSalary;
    }

    if (req.body.profileImage !== undefined) {
      employee.profileImage = req.body.profileImage?.trim() || "";
    }

    if (req.body.notes !== undefined) {
      employee.notes = req.body.notes?.trim() || "";
    }

    if (nextStatus) {
      employee.status = nextStatus;
    }

    await employee.save();

    await User.findOneAndUpdate(
      { email: req.body.previousEmail?.trim()?.toLowerCase() || previousEmail || employee.email },
      {
        name: employee.name,
        email: employee.email,
        profileImage: employee.profileImage,
        role: employee.role,
      },
      { new: true },
    );

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Employee already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Update employee server error",
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    await Employee.findByIdAndDelete(employee._id);
    await User.findOneAndDelete({ email: employee.email });

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Delete employee server error",
    });
  }
};

module.exports = {
  addEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
};
