import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/useAuth";
import { apiUrl } from "../../utils/api";
import "./LeaveManagement.css";

const LEAVE_TYPES = [
  { value: "casual", label: "Casual" },
  { value: "sick", label: "Sick" },
  { value: "annual", label: "Annual" },
  { value: "emergency", label: "Emergency" },
  { value: "other", label: "Other" },
];

const EMPTY_FORM = {
  leaveType: "casual",
  startDate: "",
  endDate: "",
  reason: "",
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const getStatusClassName = (status) => {
  if (status === "approved") {
    return "leave-status leave-status--approved";
  }

  if (status === "rejected") {
    return "leave-status leave-status--rejected";
  }

  return "leave-status leave-status--pending";
};

const LeaveManagement = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLeaveId, setActiveLeaveId] = useState("");
  const [adminNotes, setAdminNotes] = useState({});

  const token = window.localStorage.getItem("token");

  const loadLeaves = async () => {
    if (!token) {
      setLeaves([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.get(apiUrl("/leave"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setLeaves(response.data.leaves || []);
      }
    } catch (loadError) {
      setError(loadError.response?.data?.error || "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const leaveCounts = useMemo(
    () => ({
      total: leaves.length,
      pending: leaves.filter((leave) => leave.status === "pending").length,
      approved: leaves.filter((leave) => leave.status === "approved").length,
      rejected: leaves.filter((leave) => leave.status === "rejected").length,
    }),
    [leaves],
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleApplyLeave = async (event) => {
    event.preventDefault();

    const payload = {
      leaveType: formState.leaveType,
      startDate: formState.startDate,
      endDate: formState.endDate,
      reason: formState.reason.trim(),
    };

    if (!payload.startDate || !payload.endDate || !payload.reason) {
      setSubmitError("Please complete all leave request fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await axios.post(apiUrl("/leave"), payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setLeaves((currentLeaves) => [response.data.leave, ...currentLeaves]);
        setFormState(EMPTY_FORM);
      }
    } catch (requestError) {
      setSubmitError(
        requestError.response?.data?.error || "Failed to submit leave request",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminAction = async (leaveId, status) => {
    try {
      setActiveLeaveId(leaveId);
      setError("");

      const response = await axios.patch(
        apiUrl(`/leave/${leaveId}/status`),
        {
          status,
          adminNote: adminNotes[leaveId] || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setLeaves((currentLeaves) =>
          currentLeaves.map((leave) =>
            leave._id === leaveId ? response.data.leave : leave,
          ),
        );
      }
    } catch (actionError) {
      setError(actionError.response?.data?.error || "Failed to update leave status");
    } finally {
      setActiveLeaveId("");
    }
  };

  return (
    <section className="leave-page">
      <div className="leave-page__header">
        <div>
          <p className="leave-page__eyebrow">Leave management</p>
          <h1 className="leave-page__title">
            {isAdmin ? "Review Leave Requests" : "Request Leave"}
          </h1>
          <p className="leave-page__text">
            {isAdmin
              ? "Approve, reject, or move leave requests back to pending from one queue."
              : "Send a leave request to your admin and track whether it is pending, approved, or rejected."}
          </p>
        </div>
      </div>

      <div className="leave-stats">
        <div className="leave-stat">
          <span>Total</span>
          <strong>{leaveCounts.total}</strong>
        </div>
        <div className="leave-stat">
          <span>Pending</span>
          <strong>{leaveCounts.pending}</strong>
        </div>
        <div className="leave-stat">
          <span>Approved</span>
          <strong>{leaveCounts.approved}</strong>
        </div>
        <div className="leave-stat">
          <span>Rejected</span>
          <strong>{leaveCounts.rejected}</strong>
        </div>
      </div>

      {!isAdmin ? (
        <form className="leave-form" onSubmit={handleApplyLeave}>
          <div className="leave-form__grid">
            <label className="leave-form__field">
              <span>Leave Type</span>
              <select
                name="leaveType"
                value={formState.leaveType}
                onChange={handleFormChange}
              >
                {LEAVE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="leave-form__field">
              <span>Start Date</span>
              <input
                type="date"
                name="startDate"
                value={formState.startDate}
                onChange={handleFormChange}
              />
            </label>

            <label className="leave-form__field">
              <span>End Date</span>
              <input
                type="date"
                name="endDate"
                value={formState.endDate}
                onChange={handleFormChange}
              />
            </label>
          </div>

          <label className="leave-form__field">
            <span>Reason</span>
            <textarea
              name="reason"
              rows="4"
              value={formState.reason}
              onChange={handleFormChange}
              placeholder="Write a short reason for your leave request"
            />
          </label>

          <button className="leave-form__button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Apply for Leave"}
          </button>

          {submitError ? <p className="leave-page__error">{submitError}</p> : null}
        </form>
      ) : null}

      {error ? <p className="leave-page__error">{error}</p> : null}

      {loading ? (
        <div className="leave-empty">
          <h2>Loading leave requests...</h2>
        </div>
      ) : leaves.length > 0 ? (
        <div className="leave-table-wrap">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Admin Note</th>
                {isAdmin ? <th>Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td data-label="Employee">
                    <div className="leave-person">
                      <strong>{leave.employeeName}</strong>
                      <span>{leave.employeeCode || leave.employeeEmail}</span>
                    </div>
                  </td>
                  <td data-label="Type">{leave.leaveType}</td>
                  <td data-label="Dates">
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                  </td>
                  <td data-label="Days">{leave.days}</td>
                  <td data-label="Reason" className="leave-table__reason">
                    {leave.reason}
                  </td>
                  <td data-label="Status">
                    <span className={getStatusClassName(leave.status)}>{leave.status}</span>
                  </td>
                  <td data-label="Admin Note">
                    {isAdmin ? (
                      <textarea
                        className="leave-admin-note"
                        rows="2"
                        value={adminNotes[leave._id] ?? leave.adminNote ?? ""}
                        onChange={(event) =>
                          setAdminNotes((currentNotes) => ({
                            ...currentNotes,
                            [leave._id]: event.target.value,
                          }))
                        }
                        placeholder="Optional admin note"
                      />
                    ) : (
                      leave.adminNote || "-"
                    )}
                  </td>
                  {isAdmin ? (
                    <td data-label="Action">
                      <div className="leave-actions">
                        <button
                          type="button"
                          onClick={() => handleAdminAction(leave._id, "approved")}
                          disabled={activeLeaveId === leave._id}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminAction(leave._id, "rejected")}
                          disabled={activeLeaveId === leave._id}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminAction(leave._id, "pending")}
                          disabled={activeLeaveId === leave._id}
                        >
                          Pending
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="leave-empty">
          <h2>No leave requests yet</h2>
          <p>
            {isAdmin
              ? "Employee requests will show up here as soon as they apply."
              : "Submit your first leave request using the form above."}
          </p>
        </div>
      )}
    </section>
  );
};

export default LeaveManagement;
