import { createContext, useEffect, useMemo, useState } from "react";

const EmployeeContext = createContext(null);

const EMPLOYEE_STORAGE_KEY = "employees";

const getStoredEmployees = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedEmployees = window.localStorage.getItem(EMPLOYEE_STORAGE_KEY);
    const parsedEmployees = storedEmployees ? JSON.parse(storedEmployees) : [];

    return Array.isArray(parsedEmployees) ? parsedEmployees : [];
  } catch {
    return [];
  }
};

const createEmployeeId = () =>
  `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(getStoredEmployees);

  useEffect(() => {
    window.localStorage.setItem(
      EMPLOYEE_STORAGE_KEY,
      JSON.stringify(employees),
    );
  }, [employees]);

  const value = useMemo(
    () => ({
      employees,
      addEmployee: (employee) => {
        const newEmployee = {
          id: createEmployeeId(),
          status: "active",
          ...employee,
        };

        setEmployees((currentEmployees) => [...currentEmployees, newEmployee]);
        return newEmployee;
      },
    }),
    [employees],
  );

  return (
    <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>
  );
};

export { EmployeeContext, EmployeeProvider };
