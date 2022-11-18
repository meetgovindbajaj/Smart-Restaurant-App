import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/app.css";

const Register = () => {
  const history = useHistory();
  const [user, setUser] = useState({
    table: "",
    name: "",
    phone: "",
  });
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };
  const PostData = async (e) => {
    e.preventDefault();
    const { table, name, phone } = user;
    const res = await fetch("/Register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table,
        name,
        phone,
      }),
    });
    const data = await res.json();
    if (data.status === 422 || !data) {
      toast.error("Please Fill All The Required Fields");
    } else if (data.status === 423) {
      toast.warn("one user already logged in!");
    } else {
      history.push(`/Home`);
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
        - menu page
      </NavLink>
      <div className="register-container">
        <form method="POST" className="register-form-box" id="register-form">
          <div className="register-form-options">
            <input
              required
              placeholder="Enter Table No."
              className="register-form-input"
              type="number"
              name="table"
              id="table"
              autoComplete="off"
              value={user.table}
              min={1}
              max={50}
              onChange={handleInputs}
            ></input>
          </div>
          <div className="register-form-options">
            <input
              className="register-form-input-button"
              type="submit"
              name="signup"
              id="signup"
              value="go to order page"
              onClick={PostData}
            />
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
        </form>
      </div>
    </>
  );
};

export default Register;
