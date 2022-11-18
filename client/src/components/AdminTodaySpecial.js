import React, { useEffect, useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../App";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
// import {useLocation} from 'react-router-dom'
// let loader=true;
const AdminTodaySpecial = () => {
  // let location=useLocation();
  // // console.log(location.state.loader);
  // if(location.state){
  //   if(location.state.loader){
  //     // loader=true;
  //     location.state.loader=false;
  //   }
  // }
  const history = useHistory();
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const [userData, setuserData] = useState({
    title: "",
    price: "",
    quantity: "",
    img: "",
    description: "",
    category: "",
  });
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
        // loader=false;
        dispatch({ type: "ADMIN", payload: true });
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    callAboutPage();
    // eslint-disable-next-line
  }, []);
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setuserData({ ...userData, [name]: value });
  };
  const contactForm = async (e) => {
    e.preventDefault();
    // eslint-disable-next-line
    const { title, price, quantity, img, description, category } = userData;
    const res = await fetch("/Admintodayspecial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        price,
        quantity:1,
        img,
        description,
        category:"special",
      }),
    });

    const data = await res.json();
    if (data.status === 422 || !data) {
      toast.warn("Please Fill All The Required Fields");
    } else if (data.status === 400) {
      toast.error("Some Error Occured!");
    } else {
      swal("Item added to your menu", {
        icon: "success",
      });
      setuserData({
        ...userData,
        title: "",
        price: "",
        quantity: "",
        img: "",
        description: "",
        category: "",
      });
      document.getElementById("contact_form_name").value = "";
      document.getElementById("contact_form_email").value = "";
      document.getElementById("img").value = "";
      document.getElementById("desc").value = "";
    }
  };
  return (
    <>
      <div className="admin-menu-add-container">
        <div>
          <h4>Add Today Special Items</h4>
        </div>
        <form method="POST" id="contact_form" className="admin-menu-add-box">
          <div className="admin-menu-add-options">
            <input
              type="text"
              id="contact_form_name"
              className="admin-menu-add-input"
              placeholder="Input Name"
              name="title"
              onChange={handleInputs}
              required
            /></div>
            <div className="admin-menu-add-options">
            <input
              type="Number"
              id="contact_form_email"
              className="admin-menu-add-input"
              placeholder="Input Price"
              name="price"
              onChange={handleInputs}
              required
            /></div>
            <div className="admin-menu-add-options">
            <input
              type="Number"
              id="contact_form_phone"
              className="admin-menu-add-input"
              placeholder="Input Quantity"
              name="quantity"
              defaultValue={1}
              // value={1}
              max={1}
              min={1}
              onChange={handleInputs}
              required
            /></div>
            <div className="admin-menu-add-options">
            <input
              type="url"
              id="img"
              className="admin-menu-add-input"
              placeholder="Input Image Link"
              name="img"
              onChange={handleInputs}
              required
            /></div>
            <div className="admin-menu-add-options">
            <input
              type="text"
              id="category"
              className="admin-menu-add-input"
              placeholder="Input Category"
              name="category"
              defaultValue={"special"}
              value={"special"}
              onChange={handleInputs}
              required
            /></div>
            <div className="admin-menu-add-options-text">
            <textarea
              className="admin-menu-add-input-text "
              id="desc"
              cols="30"
              rows="4"
              placeholder="Input Description"
              type="text"
              name="description"
              onChange={handleInputs}
              required
            />
            
          </div>
          <div className="admin-menu-add-options">
            <button
              type="submit"
              onClick={contactForm}
              className="admin-menu-add-button"
            >
              Add Item
            </button>
          </div>
        </form>
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
};

export default AdminTodaySpecial;
