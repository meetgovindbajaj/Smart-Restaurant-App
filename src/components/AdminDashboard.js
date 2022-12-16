//ADMIN DASHBOARD MODULE
import React, { useState, useContext } from "react";
import { NavLink, useHistory, Link } from "react-router-dom";
import { UserContext } from "../App";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import AdminMessage from "./AdminMessage";
import swal from "sweetalert";
const AdminDashboard = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [userData, setuserData] = useState({});
  const callAboutPage = async () => {
    try {
      const res = await fetch("https://royalmadrasiserver.vercel.app/Admingetdata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      });
      const data = await res.json();
      setuserData(data);
      if (!res.status === 200) {
        history.push("/Adminlogin");
        const error = new Error(res.error);
        throw error;
      } else {
        // loader = false;
        dispatch({ type: "ADMIN", payload: true });
      }
    } catch (err) {
      history.push("/Adminlogin");
      console.log(err);
    }
  };
  callAboutPage();
  const logout = async () => {
    try {
      const deleteFile = await swal({
        title: "Are you sure?",
        text: "Once logged out, you will have to login again!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (deleteFile) {
        const res = await fetch("https://royalmadrasiserver.vercel.app/Adminlogout", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },credentials: 'include'
        });
        swal("User Logged out", {
          icon: "success",
        });
        dispatch({ type: "ADMIN", payload: false });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="admin-dash-container">
        <div className="admin-user-request">
          <AdminMessage />
        </div>
        <div className="admin-dash-name-container">
          <h3 className="admin-dash-name">Admin Dashboard</h3>
        </div>
        <div className="admin-dash-options">
          <Link
            className="admin-dash-opt"
            to={{
              pathname: "/Adminuseraccess",
              state: { loader: true },
            }}
          >
            tables
          </Link>
          <NavLink
            className="admin-dash-opt"
            to={{
              pathname: "/AdminUserDataAccess",
              state: { loader: true },
            }}
          >
            Reports
          </NavLink>

          <NavLink
            className="admin-dash-opt"
            to={{
              pathname: "/Adminmenuedit",
              state: { loader: true },
            }}
          >
            menu
          </NavLink>
          <NavLink
            className="admin-dash-opt"
            to={{
              pathname: "/admintodayspecialedit",
              state: { loader: true },
            }}
          >
            special
          </NavLink>
          <NavLink
            className="admin-dash-opt"
            to={{
              pathname: "/Adminhome",
              state: { loader: true },
            }}
          >
            add item (menu)
          </NavLink>
          <NavLink
            className="admin-dash-opt"
            to={{
              pathname: "/admintodayspecial",
              state: { loader: true },
            }}
          >
            add item (Special)
          </NavLink>

          <NavLink
            className="admin-dash-opt"
            to={{
              pathname: "/AdminInfo",
              state: { loader: true },
            }}
          >
            Admin Details
          </NavLink>
          <NavLink
            className="admin-dash-opt"
            to={{
              pathname: "/restroInfo",
              state: { loader: true },
            }}
          >
            Restaurant Details
          </NavLink>
          <div
            className="admin-dash-opt"
            style={{ cursor: "pointer" }}
            onClick={() => logout()}
          >
            logout
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
