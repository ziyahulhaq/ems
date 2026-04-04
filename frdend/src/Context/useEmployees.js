import { useContext } from "react";
import { EmployeeContext } from "./EmployeeContext";

export const useEmployees = () => useContext(EmployeeContext);
