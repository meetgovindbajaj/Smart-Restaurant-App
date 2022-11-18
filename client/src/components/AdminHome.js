import React, { useEffect, useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { UserContext } from "../App";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { Dropdown } from "react-bootstrap";
// import {useLocation} from 'react-router-dom'
// let loader=true;
const AdminHome = () => {
  // let location=useLocation();
  // // console.log(location.state.loader);
  // if(location.state){
  //   if(location.state.loader){
  //     loader=true;
  //     location.state.loader=false;
  //   }
  // }
  const history = useHistory();
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const [menuData, setMenuData] = useState({});
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
  const getMenu = async () => {
    try {
      const res = await fetch("/AdminMenuEdit", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setMenuData(data);
      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    callAboutPage();
    // eslint-disable-next-line
  }, []);
  getMenu();
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setuserData({ ...userData, [name]: value });
  };

  const contactForm = async (e) => {
    e.preventDefault();
    const { title, price, quantity, img, description, category } = userData;
    const res = await fetch("/Adminhome", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        price,
        quantity: quantity ? quantity : 1,
        img,
        description,
        category,
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
      document.getElementById("contact_form_phone").value = 1;
      document.getElementById("img").value = "";
      document.getElementById("desc").value = "";
      document.getElementById("category").value = "";
    }
  };
  let daata = [];
  Object.assign(daata, menuData);
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
  daata.sort(dynamicSort("title"));
  daata.sort(dynamicSort("category"));
  let category = [];
  daata.map((i) => {
    if (category.length === 0) {
      category.push(i.category);
    } else {
      let check = false;
      for (let j = 0; j < category.length; j++) {
        if (category[j] === i.category) {
          check = true;
        }
      }
      if (check === false) {
        category.push(i.category);
      }
    }
  });
  const op = () => {
    for (let i = 0; i < category.length; i++) {
      return <option>{category[i]}</option>;
    }
  };
  return (
    <>
      <div className="admin-menu-add-container">
        <div>
          <h4>Add Menu Items</h4>
        </div>
        <form method="POST" id="contact_form" className="admin-menu-add-box">
          <div className="admin-menu-add-options">
            <input
              type="text"
              id="contact_form_name"
              className="admin-menu-add-input"
              placeholder="Item Name"
              name="title"
              onChange={handleInputs}
              required
            />
          </div>
          <div className="admin-menu-add-options">
            <input
              type="number"
              id="contact_form_email"
              className="admin-menu-add-input"
              placeholder="Item Price"
              name="price"
              onChange={handleInputs}
              required
            />
          </div>
          <div className="admin-menu-add-options">
            <input
              type="number"
              id="contact_form_phone"
              className="admin-menu-add-input"
              placeholder="Item Quantity"
              name="quantity"
              defaultValue={1}
              onChange={handleInputs}
              required
            />
          </div>
          <div className="admin-menu-add-options">
            <input
              type="url"
              id="img"
              className="admin-menu-add-input"
              placeholder="Item Image Link"
              name="img"
              onChange={handleInputs}
              required
            />
          </div>
          <div className="admin-menu-add-options">
            <input
              type="text"
              id="category"
              className="admin-menu-add-input"
              placeholder="Item Category"
              name="category"
              autoComplete="off"
              onChange={handleInputs}
              required
            />
            <Dropdown>
              <Dropdown.Toggle variant="info"></Dropdown.Toggle>
              <Dropdown.Menu>
                {category.map((dat) => {
                  return (
                    <Dropdown.Item
                      onClick={() => {
                        let name = "category";
                        let value = dat;
                        setuserData({ ...userData, [name]: value });
                        document.getElementById("category").innerHTML=dat;
                        document.getElementById("category").value=dat
                      }}
                    >
                      {dat}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="admin-menu-add-options-text">
            <textarea
              className="admin-menu-add-input-text"
              id="desc"
              cols="30"
              rows="4"
              placeholder="Item Description"
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

export default AdminHome;
