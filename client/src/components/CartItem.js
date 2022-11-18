import React, { useState } from "react";
// eslint-disable-next-line
import { ToastContainer, toast } from "react-toastify";
import "./css/app.css";
import swal from "sweetalert";

const CartItem = ({ title, price, img, quantity }) => {
  const [userData, setuserData] = useState({
    title: title,
    price: price,
    quantity: quantity,
  });
  const handleadd = async () => {
    const res = await fetch(`/Home/Cart/Add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: userData.title,
        price: userData.price,
        quantity: userData.quantity,
      }),
    });
    const data = await res.json();
    if (data.quantity > userData.quantity) {
      setuserData({
        title: data.title,
        price: data.price,
        quantity: data.quantity,
      });
    }
    if (data.status === 400) {
      toast.error("Some Error Occured!");
    }
  };
  const handlesub = async () => {
    const res = await fetch(`/Home/Cart/Sub`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: userData.title,
        price: userData.price,
        quantity: userData.quantity,
      }),
    });
    const data = await res.json();
    if (data.quantity < userData.quantity) {
      setuserData({
        title: data.title,
        price: data.price,
        quantity: data.quantity,
      });
    }
    if (data.status === 400) {
      toast.error("Some Error Occured!");
    }
  };
  const handleDelete = async () => {
    const deleteFile = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover it!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (deleteFile) {
      const res = await fetch(`/Home/Cart/Delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          price,
        }),
      });
      const data = await res.json();
      if (data.status === 400) {
        toast.error("Some Error Occured!");
      } else if (data.status === 201) {
        swal("Item deleted from cart", {
          icon: "success",
        });
        setuserData({ title: "", price: "", quantity: "" });
      }
    } else {
      swal("Your Item is safe!");
    }
  };
  if (userData.title) {
    return (
      <div className="cart-box">
        <div className="cart-image-container">
          <img src={img} alt="jsx-a11y/alt-text" className="cart-image" />
        </div>
        <p className="cart-box-body">
          <div className="cart-box-title">
            <h5 className="card-title" style={{ fontWeight: "bolder" }}>
              {title}
            </h5>
          </div>
          <h5 className="cart-box-price">
            Price:
            <span
              style={{
                color: "greenyellow",
                backgroundColor: "rgb(34, 34, 36)",
              }}
            >
              {" "}
              {userData.price * userData.quantity} INR
            </span>
          </h5>
          <div className="cart-quantity">
            <button className="cart-btn cart-sub" onClick={handlesub}>
              -
            </button>
            <p>{userData.quantity}</p>
            <button className="cart-btn cart-add" onClick={handleadd}>
              +
            </button>
          </div>
          <button
            className="cart-btn cart-del text-uppercase"
            onClick={handleDelete}
          >
            <i class="fa fa-trash"></i>
          </button>
        </p>
      </div>
    );
  } else {
    return <></>;
  }
};

export default CartItem;
