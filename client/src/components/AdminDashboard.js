import React, { useState, useContext } from "react";
import { NavLink, useHistory, Link } from "react-router-dom";
import { UserContext } from "../App";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import AdminMessage from "./AdminMessage";
import swal from "sweetalert";
// import { useLocation } from "react-router-dom";
// let loader = true;
const AdminDashboard = () => {
  // let location = useLocation();
  // // console.log(location.state.loader);
  // if (location.state) {
  //   if (location.state.loader) {
  //     loader = true;
  //     location.state.loader = false;
  //   }
  // }
  const history = useHistory();
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  // eslint-disable-next-line
  const [userData, setuserData] = useState({});

  const callAboutPage = async () => {
    try {
      const res = await fetch("/Admingetdata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
  // useEffect(() => {
  callAboutPage();
  // eslint-disable-next-line
  // }, []);
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
        // eslint-disable-next-line
        const res = await fetch("/Adminlogout", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        swal("User Logged out", {
          icon: "success",
        });
        dispatch({ type: "ADMIN", payload: false });
        // history.push("/adminlogin", { replace: true });
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
