import React, { useState, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.css";
import "./css/app.css";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";

const AdminLogin = () => {
  
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };
  const PostData = async (e) => {
    e.preventDefault();
    const { email, password } = user;
    const cTable = await swal("ENTER ACCESS CODE", {
      content: {
        element: "input",
        attributes: {
          type: "password",
          id:"swal",
        },
      },
    });
    if (cTable) {
      const res = await fetch("/Adminlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          key:Number(cTable),
        }),
      });

      const data = await res.json();
      if (data.status === 422 || !data) {
        toast.error("Please Fill All The Required Fields");
      } else if (data.status === 400) {
        toast.warn("Invalid Credentials!");
      } else {
        toast.success(`✨ Login Successful ✨`, { hideProgressBar: true });
        setTimeout(() => {
          dispatch({ type: "USER", payload: true });
          history.push("/Admindashboard");
        }, 1800);
      }
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
        <form method="POST" className="register-form-box" id="register-form">
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
              className="register-form-input-button"
              type="submit"
              name="signup"
              id="signup"
              value="Sign In"
              onClick={PostData}
            />
          </div>
          {/* <NavLink to="/adminRegister" className="admin-login-page-link">
            New to Website? Create an account.
          </NavLink> */}
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

export default AdminLogin;
