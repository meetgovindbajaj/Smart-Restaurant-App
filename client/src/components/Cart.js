import React, { useState, useContext } from "react";
import { useHistory, NavLink } from "react-router-dom";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import CartItems from "./CartItem";
import "./css/app.css";
import swal from "sweetalert";
import { useLocation } from "react-router-dom";
let loader = true;
let timer = null;
const Cart = ({ title, price, quantity, img }) => {
  let location = useLocation();
  // console.log(location.state.loader);
  if (location.state) {
    if (location.state.loader) {
      loader = true;
      location.state.loader = false;
    }
  }
  let items = [];
  const history = useHistory();
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const [userData, setuserData] = useState({});
  const callAboutPage = async () => {
    try {
      const res = await fetch("/Home/Cart", {
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
  Object.assign(daata, userData.cart);
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
    // eslint-disable-next-line
    const data = await res.json();
  };
  const handleAdd = async () => {
    const addFile = await swal({
      title: "Are you sure?",
      text: "You want to order these items?",
      buttons: true,
      dangerMode: false,
    });
    if (addFile) {
      const res = await fetch(`/Home/Cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
        }),
      });
      const data = await res.json();
      sendMessage(userData.table, items);
      if (data.status === 400) {
        toast.error("Some Error Occured!");
      } else if (data.status === 201) {
        clearTimeout(timer);
        document.getElementById("order-view-cart").style.bottom = "0";
        timer = setTimeout(() => {
          document.getElementById("order-view-cart").style.bottom = "-10vh";
        }, 15000);
        items = [];
        swal("Ordered Successfully", {
          icon: "success",
        });
        // history.push("/home/menu");
      }
    } else {
      swal("Order Canceled!");
    }
  };
  let linkinvoice = `/Home/Invoice`;

  return loader ? (
    <div
      className="menu-body-1"
      style={{ position: "relative", background: "black" }}
    >
      <div class="loader"></div>
    </div>
  ) : (
    <>
      {daata[0] ? (
        <>
          <div
            className="menu-container"
            style={{ paddingBottom: "15vh", minHeight: "78vh" }}
          >
            {daata.map((Data) => {
              items = items.concat({
                title: Data.title,
                quantity: Data.quantity,
                price: Data.price,
                img: Data.img,
              });

              return <CartItems key={Data.id} {...Data} />;
            })}
          </div>
          <div>
            <h5 className="text-center text-light mb-0 bg-black p-2 align-content-center justify-content-around text-uppercase fw-bold fixed-bottom">
              <button
                id="order"
                className="cart-button text-uppercase"
                onClick={handleAdd}
              >
                Order now
              </button>
            </h5>
          </div>
        </>
      ) : (
        <div className="cart-empty" style={{ marginInline: "auto" }}>
          <div className="cart-empty-heading">CART IS EMPTY</div>
        </div>
      )}
      <NavLink
        id="order-view-cart"
        className="order-view-cart"
        to={{
          pathname: linkinvoice,
          state: { loader: true },
        }}
      >
        view invoice
      </NavLink>
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
};
export default Cart;
