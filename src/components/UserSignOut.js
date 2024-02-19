// Modules
import { useContext, useEffect } from "react";
import { Navigate } from 'react-router-dom';

// Context
import UserContext from "../context/UserContext";

const UserSignOut = () => {
  const { actions } = useContext(UserContext);
  useEffect(() => actions.signOut());
  return <Navigate to="/" replace />;
}

export default UserSignOut;
