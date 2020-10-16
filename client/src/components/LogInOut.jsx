import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function LogInOut({ isAuthenticated, setAuth }) {
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    toast.success("You logged out successfully"); // makes a logout toast
  };

  function Login() {
    if (isAuthenticated) {
      return (
        <Link style={{ padding: "10px" }} to="" onClick={logout}>
          Logout
        </Link>
      );
    }
    return (
      <div>
        <Link style={{ padding: "10px" }} to="/register">
          Register
        </Link>
        <Link to="/login">Login</Link>
      </div>
    );
  }
  return (
    <div>
      <Login isAuthenticated={false} />
    </div>
  );
}

export default LogInOut;
