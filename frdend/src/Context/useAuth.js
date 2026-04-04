import { useContext } from "react";
import { UserContext } from "./authContext";

export const useAuth = () => useContext(UserContext);
