const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getDayCount = (startDate, endDate) => {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((endDate - startDate) / millisecondsPerDay) + 1;
};

const getLeaves = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { user: req.user._id };
    const leaves = await Leave.find(query).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to load leave requests",
    });
  }
};

const createLeave = async (req, res) => {
  try {
    const startDate = normalizeDate(req.body.startDate);
    const endDate = normalizeDate(req.body.endDate);
    const leaveType = req.body.leaveType?.trim().toLowerCase();
    const reason = req.body.reason?.trim();

    if (!startDate || !endDate || !leaveType || !reason) {
      return res.status(400).json({
        success: false,
        error: "Leave type, start date, end date, and reason are required",
      });
    }

    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        error: "End date must be the same as or after the start date",
      });
    }

    if (!["sick", "casual", "annual", "emergency", "other"].includes(leaveType)) {
      return res.status(400).json({
        success: false,
        error: "Invalid leave type",
      });
    }

    const employee = await Employee.findOne({ email: req.user.email });
    const leave = await Leave.create({
      user: req.user._id,
      employee: employee?._id || null,
      employeeName: employee?.name || req.user.name,
      employeeEmail: employee?.email || req.user.email,
      employeeCode: employee?.employeeId || "",
      department: employee?.department || "",
      designation: employee?.designation || "",
      leaveType,
      startDate,
      endDate,
      days: getDayCount(startDate, endDate),
      reason,
    });

    return res.status(201).json({ success: true, leave });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create leave request",
    });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const status = req.body.status?.trim().toLowerCase();
    const adminNote = req.body.adminNote?.trim() || "";

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Status must be pending, approved, or rejected",
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        error: "Leave request not found",
      });
    }

    leave.status = status;
    leave.adminNote = adminNote;
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    await leave.save();

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update leave status",
    });
  }
};

module.exports = {
  getLeaves,
  createLeave,
  updateLeaveStatus,
};
