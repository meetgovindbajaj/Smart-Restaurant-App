import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.css";
import "./css/app.css";
import "react-toastify/dist/ReactToastify.css";

const AdminRegister = () => {
  const history = useHistory();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  });
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };
  const PostData = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, cpassword } = user;
    const res = await fetch("/Adminregister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        cpassword,
      }),
    });
    const data = await res.json();
    if (data.status === 422 || !data) {
      toast.error("Please Fill All The Required Fields");
    } else if (data.status === 400) {
      toast.warn("Email Already Registered!");
    } else if (data.status === 401) {
      toast.warn("Phone No. Already Registered!");
    } else if (data.status === 402) {
      toast.warn("Passwords Are Not Matching");
    } else {
      toast.success(`Registration Successful!`, { hideProgressBar: true });
      setTimeout(() => {
        history.push("/Adminlogin");
      }, 1800);
    }
  };
  return (
    <>
      <NavLink
        className="menu-back"
        to={{
          pathname: "/menu",
          state: { loader: true },
        }}
      >
        go to menu
      </NavLink>
      <div className="register-container">
        <form
          method="POST"
          className="admin-register-form-box"
          id="register-form"
        >
          <div className="register-form-options">
            <input
              required
              placeholder="Enter Name"
              className="register-form-input"
              type="text"
              name="name"
              id="name"
              autoComplete="off"
              value={user.name}
              onChange={handleInputs}
            ></input>
          </div>
          <div className="register-form-options">
            <input
              required
              placeholder="Enter Email"
              className="register-form-input"
              type="email"
              name="email"
              id="email"
              autoComplete="off"
              value={user.email}
              onChange={handleInputs}
            ></input>
          </div>
          <div className="register-form-options">
            <input
              required
              placeholder="Enter Phone No."
              className="register-form-input"
              type="tel"
              name="phone"
              id="phone"
              autoComplete="off"
              value={user.phone}
              onChange={handleInputs}
            ></input>
          </div>
          <div className="register-form-options">
            <input
              required
              minLength="8"
              placeholder="Enter Password"
              className="register-form-input"
              type="password"
              name="password"
              id="password"
              autoComplete="off"
              value={user.password}
              onChange={handleInputs}
            ></input>
          </div>
          <div className="register-form-options">
            <input
              required
              minLength="8"
              placeholder="Enter Password Again"
              className="register-form-input"
              type="password"
              name="cpassword"
              id="cpassword"
              autoComplete="off"
              value={user.cpassword}
              onChange={handleInputs}
            ></input>
          </div>
          <div className="register-form-options">
            <input
              className="register-form-input-button"
              type="submit"
              name="signup"
              id="signup"
              value="register"
              onClick={PostData}
            />
          </div>
          <NavLink to="/Adminlogin" className="admin-login-page-link">
            Already Registered? Login Here.
          </NavLink>
        </form>
      </div>

      <ToastContainer
        position="top-center"
        theme="colored"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </>
  );
};

export default AdminRegister;
