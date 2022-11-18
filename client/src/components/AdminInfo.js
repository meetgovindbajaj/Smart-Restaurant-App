import React, { useState, useContext, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { useLocation } from "react-router-dom";
let loader = true;
const AdminInfo = () => {
  
  let location = useLocation();
  // console.log(location.state.loader);
  if (location.state) {
    if (location.state.loader) {
      loader = true;
      location.state.loader = false;
    }
  }
  const history = useHistory();
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  // eslint-disable-next-line
  const [userData, setuserData] = useState({});
  const callAboutPage = async () => {
    try {
      const res = await fetch("/AdminInfo", {
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
        loader = false;
        dispatch({ type: "ADMIN", payload: true });
      }
    } catch (err) {
      history.push("/Adminlogin");
      console.log(err);
    }
  };
  callAboutPage();
  let dataa = [];
  Object.assign(dataa, userData);
  return loader ? (
    <div
      className="menu-body-1"
      style={{ position: "relative", background: "black" }}
    >
      <div class="loader"></div>
    </div>
  ) : (
    <div className="admin-info-page-container">
      <NavLink
        className="menu-back"
        to={{
          pathname: "/AdminDashboard",
          state: { loader: true },
        }}
      >
        back
      </NavLink>
      <div className="admin-info-page">
        {dataa.map((i) => {
          return (
            <div className="admin-info-page-box">
              <div className="admin-info-page-inside" style={{ textTransform:"capitalize" }}><span>Username:</span> <pre> </pre>{" ",i.name}</div>
              <div className="admin-info-page-inside"><span>Email:</span><pre> </pre> {i.email}</div>
              <button
              className="admin-info-page-btn"
                onClick={async () => {
                  const addFile = await swal({
                    title: "Are you sure?",
                    text: "You want to remove this account?",
                    buttons: true,
                    dangerMode: true,
                  });
                  if (addFile) {
                    const cTable = await swal("ENTER ACCESS CODE", {
                      content: {
                        element: "input",
                        attributes: {
                          type: "text",
                          id:"swal",
                        },
                      },
                    });
                    if (cTable) {
                      const res = await fetch(`/AdminInfoDel`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          email: i.email,
                          code: Number(cTable),
                        }),
                      });
                      const data1 = await res.json();
                      if (data1.status === 400) {
                        swal("Cannot Delete Your Own Account", {
                          icon: "warning",
                        });
                      } else if (data1.status === 401) {
                        swal("Wrong Code", {
                          icon: "error",
                        });
                      } else {
                        swal("Admin Removed", {
                          icon: "success",
                        });
                      }
                    }
                  }
                }}
              >
                <img height={20} width={20} src="https://img.icons8.com/ios-glyphs/30/000000/filled-trash.png"/>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminInfo;
