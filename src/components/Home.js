import React, { useState, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/app.css";
import { useLocation } from "react-router-dom";
let loader = true;
export default function Home() {
  let location = useLocation();
  // console.log(location.state.loader);
  if (location.state) {
    if (location.state.loader) {
      loader = true;
      location.state.loader = false;
    }
  }
  const history = useHistory();
  // console.log(history.location.pathname);
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const [userData, setuserData] = useState({});
  const callAboutPage = async () => {
    try {
      const res = await fetch("/getdata", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setuserData(data);
      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      } else {
        loader = false;
        dispatch({ type: "USER", payload: true });
      }
    } catch (err) {
      history.push("/Register");
      console.log(err);
    }
  };
  callAboutPage();
  const sendMessage = async (table, message) => {
    const res = await fetch("/Message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table,
        message,
      }),
    });
    const data = await res.json();
    if (data.status === 422 || !data) {
      toast.error("Please Fill All The Required Fields");
    } else if (data.status === 423) {
      toast.warn("one user already logged in!");
    } else {
      toast.success("Request sent");
    }
  };
  let link = `/Home`;
  let linkmenu = `/Home/Menu`;
  let linkcart = `/Home/Cart`;
  let linkinvoice = `/Home/Invoice`;
  let linkTodaySpecial = `/Home/TodaySpecial`;

  return (
    <>
      <section className="Home-body">
        <div className="home-table">table no. {userData.table}</div>
        <main className="home-main">
          <div className="home-options">
            <NavLink
              className="home-nav-link text-center home-button home-btn1"
              to={{
                pathname: linkmenu,
                state: { loader: true },
              }}
            >
              order now
            </NavLink>
          </div>
          <div className="home-options">
            <NavLink
              className="home-nav-link text-center home-button home-btn2"
              to={link}
              onClick={() => sendMessage(userData.table, "Call waiter")}
            >
              call waiter
            </NavLink>
          </div>
          <div className="home-options">
            <NavLink
              className="home-nav-link text-center home-button home-btn2"
              to={link}
              onClick={() => sendMessage(userData.table, "Clean my table")}
            >
              clean table
            </NavLink>
          </div>
          <div className="home-options">
            <NavLink
              className="home-nav-link text-center home-button home-btn2"
              to={link}
              onClick={() => sendMessage(userData.table, "I need water")}
            >
              req. water
            </NavLink>
          </div>
          <div className="home-options">
            <NavLink
              className="home-nav-link text-center home-button home-btn2"
              to={{
                pathname: linkTodaySpecial,
                state: { loader: true },
              }}
            >
              Today's Special
            </NavLink>
          </div>
          <div className="home-options">
            <NavLink
              className="home-nav-link text-center home-button home-btn2"
              to={{
                pathname: linkcart,
                state: { loader: true },
              }}
            >
              view cart
            </NavLink>
          </div>
          <div className="home-options">
            <NavLink
              className="home-nav-link text-center home-button home-btn2"
              to={{
                pathname: linkinvoice,
                state: { loader: true },
              }}
            >
              view invoice
            </NavLink>
          </div>
        </main>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
        />
      </section>
    </>
  );
}
