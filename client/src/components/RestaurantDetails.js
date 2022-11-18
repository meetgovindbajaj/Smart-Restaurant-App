import React, { useState, useContext, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

let loader = true;
const RestaurantDetails = () => {
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
      const res = await fetch("/restroInfo", {
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
  let title = "",
    email = "",
    phone = "",
    landline = "",
    address = "",
    gst = "",
    category = "",
    cgst = "",
    sgst = "",
    discount = "";
  const setInfo = async () => {
    const addFile = await swal({
      title: "Are you sure?",
      text: "You want to update Info?",
      buttons: true,
      dangerMode: true,
    });
    if (addFile) {
      const cTable = await swal("ENTER ACCESS CODE", {
        content: {
          element: "input",
          attributes: {
            type: "text",
            id:"swal"
          },
        },
      });
      if(cTable==="259700"){

        const { value: formValues } = await Swal.fire({
          title: "Edit Details",
          width: "90%",
          heightAuto: false,
          height: "90vh",
          html:
            '<input id="swal-input1" placeholder="Change Property Name" class="swal2-input">' +
            '<input id="swal-input2" placeholder="Change Email" class="swal2-input">' +
            '<input id="swal-input3" placeholder="Change Phone No." class="swal2-input">' +
            '<input id="swal-input4" placeholder="Change LandLine No." class="swal2-input">' +
            '<input id="swal-input5" placeholder="Change Address" class="swal2-input">' +
            '<input id="swal-input6" placeholder="Change GST No." class="swal2-input">' +
            '<input id="swal-input7" placeholder="Change category" class="swal2-input">' +
            '<input id="swal-input8" placeholder="Change CGST @val%" class="swal2-input">' +
            '<input id="swal-input9" placeholder="Change SGST @val%" class="swal2-input">' +
            '<input id="swal-input10" placeholder="Change Discount @val%" class="swal2-input">',
          focusConfirm: false,
          confirmButtonText: "Save",
          showDenyButton: true,
          backdrop: true,
          denyButtonText: `Don't save`,
          preConfirm: () => {
            return [
              document.getElementById("swal-input1").value,
              document.getElementById("swal-input2").value,
              document.getElementById("swal-input3").value,
              document.getElementById("swal-input4").value,
              document.getElementById("swal-input5").value,
              document.getElementById("swal-input6").value,
              document.getElementById("swal-input7").value,
              document.getElementById("swal-input8").value,
              document.getElementById("swal-input9").value,
              document.getElementById("swal-input10").value,
            ];
          },
        });
  
        if (formValues) {
          for (let i = 0; i < formValues.length; i++) {
            if (i === 0) {
              title = formValues[i];
            }
            if (i === 1) {
              email = formValues[i];
            }
            if (i === 2) {
              phone = formValues[i];
            }
            if (i === 3) {
              landline = formValues[i];
            }
            if (i === 4) {
              address = formValues[i];
            }
            if (i === 5) {
              gst = formValues[i];
            }
            if (i === 6) {
              category = formValues[i];
            }
            if (i === 7) {
              cgst = formValues[i];
            }
            if (i === 8) {
              sgst = formValues[i];
            }
            if (i === 9) {
              discount = formValues[i];
            }
          }
        }
  
        const res = await fetch(`/restroInfoEdit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            email,
            phone,
            landline,
            address,
            gst,
            category,
            cgst,
            sgst,
            discount,
          }),
        });
        const data = await res.json();
        if (data.status === 400) {
          Swal.fire("Changes are not saved", "", "info");
        } else if (data.status === 201) {
          Swal.fire("Saved!", "", "success");
          // history.push("/home/menu");
        }
      }else{
        swal("Wrong Code", {
          icon: "error",
        });
      }
    } else {
      swal("Update Canceled!");
    }
  };
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
      <div className="restro-page-container">
        <div className="restro-container">
          <div className="restro-box">
            <span>Restaurant:</span>
            <pre> </pre>
            {dataa[0].title ? dataa[0].title : "No data stored"}
          </div>
          <div className="restro-box">
            <span>email id:</span>
            <pre> </pre>
            {dataa[0].email ? dataa[0].email : "No data stored"}
          </div>
          <div className="restro-box">
            <span>phone no.:</span>
            <pre> </pre>
            {dataa[0].phone ? dataa[0].phone : "No data stored"}
          </div>
          <div className="restro-box">
            <span>landline:</span>
            <pre> </pre>
            {dataa[0].landLine ? dataa[0].landLine : ""}
          </div>
          <div className="restro-box">
            <span>address:</span>
            <pre> </pre>
            {dataa[0].address ? dataa[0].address : "No data stored"}
          </div>
          <div className="restro-box">
            <span>gst no.:</span>
            <pre> </pre>
            {dataa[0].gst ? dataa[0].gst : "No data stored"}
          </div>
          <div className="restro-box">
            <span>category:</span>
            <pre> </pre>
            {dataa[0].category ? dataa[0].category : "No data stored"}
          </div>
          <div className="restro-box">
            <span>cgst:</span>
            <pre> </pre>
            {dataa[0].cgst ? "@" + dataa[0].cgst + "%" : "No data stored"}
          </div>
          <div className="restro-box">
            <span>sgst:</span>
            <pre> </pre>
            {dataa[0].sgst ? "@" + dataa[0].sgst + "%" : "No data stored"}
          </div>
          <div className="restro-box">
            <span>discount:</span>
            <pre> </pre>
            {dataa[0].discount ? "@" + dataa[0].discount + "%" : "@0%"}
          </div>
          <button
            className="restro-btn"
            onClick={() => {
              setInfo();
            }}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
