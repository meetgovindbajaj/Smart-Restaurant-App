import "./components/css/app.css";
import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import ErrorPage from "./components/ErrorPage";
import Invoice from "./components/Invoice";
import Menu from "./components/Menu";
import TodaySpecial from "./components/TodaySpecial";
import Register from "./components/Register";
import React, { createContext, useReducer } from "react";
import { initialState, reducer } from "./reducer/UseReducer";
import AdminRegister from "./components/AdminRegister";
import AdminLogin from "./components/AdminLogin";
import AdminHome from "./components/AdminHome";
import AdminTodaySpecial from "./components/AdminTodaySpecial";
import OuterMenu from "./components/OuterMenu";
import OuetrTodaySpecial from "./components/OuterTodaySpecial";
import AdminUserAccess from "./components/AdminUserAccess";
import AdminDashboard from "./components/AdminDashboard";
import AdminMenuEdit from "./components/AdminMenuEdit";
import AdminTodaySpecialEdit from "./components/AdminTodaySpecialEdit";
import Navigation from "./components/Navigation";
import AdminUserDataAccess from "./components/AdminUserDataAccess";
import AdminInfo from "./components/AdminInfo";
import RestaurantDetails from "./components/RestaurantDetails";
import AdminInvoiceEdit from "./components/AdminInvoiceEdit";
import PrintPage from "./components/PrintPage";
import PrintPage1 from "./components/PrintPage1";
import PrintPage2 from "./components/PrintPage2";
export const UserContext = createContext();
const Routing = () => {
  return (
    <Switch>
      {/* outer today special */}
      <Route path="/TodaySpecial">
        <Navbar />
        <Navigation link="special" />
        <OuetrTodaySpecial />
      </Route>
      {/*outer menu */}
      <Route path="/Menu">
        <Navbar />
        <Navigation link="menu" />
        <OuterMenu />
      </Route>
      {/*admin register*/}
      <Route path="/Adminregister">
        <Navbar />
        <AdminRegister />
      </Route>
      {/* admin info */}
      <Route path="/Admininfo">
        <Navbar />
        <AdminInfo />
      </Route>
      {/*admin login*/}
      <Route path="/Adminlogin">
        <Navbar />
        <AdminLogin />
      </Route>
      {/*restro details*/}
      <Route path="/restroInfo">
        <Navbar />
        <RestaurantDetails />
      </Route>
      {/*admin dashboard*/}
      <Route path="/Admindashboard">
        <Navbar />
        <AdminDashboard />
      </Route>
      {/*admin tables*/}
      <Route path="/AdminUserAccess">
        <Navbar />
        <Navigation link="admintable" />
        <AdminUserAccess />
      </Route>
      {/*admin user data access*/}
      <Route path="/AdminUserDataAccess">
        <Navbar />
        <Navigation link="adminuserdataaccess" />
        <AdminUserDataAccess />
      </Route>
      {/*admin invoice edit*/}
      <Route path="/AdminInvoiceEdit">
        <Navbar />
        <AdminInvoiceEdit />
      </Route>
      {/*admin menu edit*/}
      <Route path="/AdminMenuEdit">
        <Navbar />
        <Navigation link="adminmenuedit" />
        <AdminMenuEdit />
      </Route>
      {/*admin todays special edit*/}
      <Route path="/AdminTodaySpecialEdit">
        <Navbar />
        <Navigation link="adminspecialedit" />
        <AdminTodaySpecialEdit />
      </Route>
      {/*admin add menu*/}
      <Route path="/Adminhome">
        <Navbar />
        <Navigation link="adminmenuadd" />
        <AdminHome />
      </Route>
      {/*admin add todays special*/}
      <Route path="/Admintodayspecial">
        <Navbar />
        <Navigation link="adminspecialadd" />
        <AdminTodaySpecial />
      </Route>
      {/*print page message*/}
      <Route path="/printpage">
        <PrintPage />
      </Route>
      {/*print page 1*/}
      <Route path="/printpage1">
        <PrintPage1 />
      </Route>
      {/*print page 2*/}
      <Route path="/printpage2">
        <PrintPage2 />
      </Route>
      {/*user register*/}
      <Route path="/Register">
        <Navbar />
        <Register />
      </Route>
      {/*user cart*/}
      <Route path="/Home/Cart">
        <Navbar />
        <Navigation link="cart" />
        <Cart />
      </Route>
      {/*user invoice*/}
      <Route path="/Home/Invoice">
        <Navbar />
        <Navigation link="invoice" />
        <Invoice />
      </Route>
      {/*user menu*/}
      <Route path="/Home/Menu">
        <Navbar />
        <Navigation link="homemenu" />
        <Menu />
      </Route>
      {/*user todays special*/}
      <Route path="/Home/TodaySpecial">
        <Navbar />
        <Navigation link="homespecial" />
        <TodaySpecial />
      </Route>
      {/*outer menu*/}
      <Route exact path="/">
        <Navbar />
        <Navigation link="menu" />
        <OuterMenu />
      </Route>
      {/*user home*/}
      <Route path="/Home">
        <Navbar />
        <Home />
      </Route>
      {/*error page*/}
      <Route path="/">
        <Navbar />
        <ErrorPage />
      </Route>
    </Switch>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Routing />
      </UserContext.Provider>
    </>
  );
};

export default App;
