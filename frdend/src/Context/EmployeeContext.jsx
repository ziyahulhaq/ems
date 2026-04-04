import axios from "axios";
import { createContext, useEffect, useMemo, useState } from "react";

const EmployeeContext = createContext(null);
const EMPLOYEE_API_URL = "http://localhost:3444/api/employee";

const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshEmployees = async () => {
    const token = window.localStorage.getItem("token");

    if (!token) {
      setEmployees([]);
      setError("");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.get(EMPLOYEE_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (fetchError) {
      setError(fetchError.response?.data?.error || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEmployees();
    window.addEventListener("auth-changed", refreshEmployees);

    return () => {
      window.removeEventListener("auth-changed", refreshEmployees);
    };
  }, []);

  const value = useMemo(
    () => ({
      employees,
      loading,
      error,
      refreshEmployees,
      addEmployee: async (employee) => {
        const token = window.localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again");
        }

        const response = await axios.post(
          `${EMPLOYEE_API_URL}/add`,
          employee,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.data.success) {
          throw new Error("Failed to save employee");
        }

        setEmployees((currentEmployees) => [
          response.data.employee,
          ...currentEmployees,
        ]);
        setError("");
        return response.data.employee;
      },
      clearError: () => setError(""),
    }),
    [employees, loading, error],
  );

  return (
    <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>
  );
};

export { EmployeeContext, EmployeeProvider };
