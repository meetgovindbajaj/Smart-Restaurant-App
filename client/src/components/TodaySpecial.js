import React, { useState, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "../components/css/app.css";
import { useLocation } from "react-router-dom";
let loader = true;
let timer=null;
export default function TodaySpecial() {
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
  const [userData, setuserData] = useState({});

  const callAboutPage = async () => {
    try {
      const res = await fetch("/TodaySpecial", {
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
  let daata = [];
  Object.assign(daata, userData);

  const handleAdd = async (index) => {
    const res = await fetch(`/Home/Menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: daata[index].title,
        price: daata[index].price,
        img: daata[index].img,
        quantity: daata[index].quantity,
      }),
    });

    const data = await res.json();
    if (data.status === 422) {
      toast.error("Some Error Occured!");
    } else if (data.status === 421) {
      toast.warning("Item already in cart");
    } else {
      clearTimeout(timer);
      document.getElementById("order-view-cart").style.bottom = "0";
      timer=setTimeout(() => {
        document.getElementById("order-view-cart").style.bottom = "-10vh";
      }, 15000);
      toast.success("item added to cart!");
    }
  };
  function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a, b) {
      if (sortOrder === -1) {
        return b[property].toString().localeCompare(a[property]);
      } else {
        return a[property].toString().localeCompare(b[property]);
      }
    };
  }
  let linkcart = `/Home/Cart`;
  daata.sort(dynamicSort("title"));
  return loader ? (
    <div
      className="menu-body-1"
      style={{ position: "relative", background: "black" }}
    >
      <div class="loader"></div>
    </div>
  ) : (
    <>
      <div className="menu-container" style={{ minHeight: "78vh" }}>
        {daata.map((currItem, index) => {
          return (
            <div className="menu-box">
              <div className="menu-image-container">
                <img
                  loading="lazy"
                  src={currItem.img}
                  alt="jsx-a11y/alt-text"
                  className="menu-image"
                  // onClick={handleClick}
                />
                <button
                  className="menu-image-button"
                  onClick={() => handleAdd(index)}
                >
                  ADD TO CART
                </button>
              </div>
              <p className="menu-box-body">
                <div className="menu-box-title">
                  <h5 className="card-title" style={{ fontWeight: "bolder" }}>
                    {currItem.title}
                  </h5>
                </div>
                <div
                  className="container-fluid menu-box-description"
                  style={{ color: "silver" }}
                >
                  <>{currItem.description}</>
                </div>
                <h5>
                  Price:
                  <span
                    style={{
                      color: "greenyellow",
                      backgroundColor: "rgb(34, 34, 36)",
                    }}
                  >
                    {" "}
                    {currItem.price} INR
                  </span>
                </h5>
                <button
                  className="menu-box-button menu-box-btn"
                  onClick={() => handleAdd(index)}
                >
                  ADD TO CART
                </button>
              </p>
            </div>
          );
        })}
        <NavLink
          id="order-view-cart"
          className="order-view-cart"
          to={{
            pathname: linkcart,
            state: { loader: true },
          }}
        >
          view cart
        </NavLink>
      </div>
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
    </>
  );
}
