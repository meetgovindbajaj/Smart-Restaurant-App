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
      <Route path="//* link */">
        <Navbar />
        <Navigation link="special" />
        <OuetrTodaySpecial />
      </Route>
      {/*outer menu */}
      <Route path="//* link */">
        <Navbar />
        <Navigation link="menu" />
        <OuterMenu />
      </Route>
      {/*admin register*/}
      <Route path="//* link */">
        <Navbar />
        <AdminRegister />
      </Route>
      {/* admin info */}
      <Route path="//* link */">
        <Navbar />
        <AdminInfo />
      </Route>
      {/*admin login*/}
      <Route path="//* link */">
        <Navbar />
        <AdminLogin />
      </Route>
      {/*restro details*/}
      <Route path="//* link */">
        <Navbar />
        <RestaurantDetails />
      </Route>
      {/*admin dashboard*/}
      <Route path="//* link */">
        <Navbar />
        <AdminDashboard />
      </Route>
      {/*admin tables*/}
      <Route path="//* link */">
        <Navbar />
        <Navigation link="admintable" />
        <AdminUserAccess />
      </Route>
      {/*admin user data access*/}
      <Route path="//* link */">
        <Navbar />
        <Navigation link="adminuserdataaccess" />
        <AdminUserDataAccess />
      </Route>
      {/*admin invoice edit*/}
      <Route path="//* link */">
        <Navbar />
        <AdminInvoiceEdit />
      </Route>
      {/*admin menu edit*/}
      <Route path="//* link */">
        <Navbar />
        <Navigation link="adminmenuedit" />
        <AdminMenuEdit />
      </Route>
      {/*admin todays special edit*/}
      <Route path="//* link */">
        <Navbar />
        <Navigation link="adminspecialedit" />
        <AdminTodaySpecialEdit />
      </Route>
      {/*admin add menu*/}
      <Route path="//* link */">
        <Navbar />
        <Navigation link="adminmenuadd" />
        <AdminHome />
      </Route>
      {/*admin add todays special*/}
      <Route path="//* link */">
        <Navbar />
        <Navigation link="adminspecialadd" />
        <AdminTodaySpecial />
      </Route>
      {/*print page message*/}
      <Route path="//* link */">
        <PrintPage />
      </Route>
      {/*print page 1*/}
      <Route path="//* link */">
        <PrintPage1 />
      </Route>
      {/*print page 2*/}
      <Route path="//* link */">
        <PrintPage2 />
      </Route>
      {/*user register*/}
      <Route path="//* link */">
        <Navbar />
        <Register />
      </Route>
      {/*user cart*/}
      <Route path="//* link */">
        <Navbar />
        <Navigation link="cart" />
        <Cart />
      </Route>
      {/*user invoice*/}
      <Route path="//* link */">
        <Navbar />
        <Navigation link="invoice" />
        <Invoice />
      </Route>
      {/*user menu*/}
      <Route path="//* link */">
        <Navbar />
        <Navigation link="homemenu" />
        <Menu />
      </Route>
      {/*user todays special*/}
      <Route path="//* link */">
        <Navbar />
        <Navigation link="homespecial" />
        <TodaySpecial />
      </Route>
      {/*outer menu*/}
      <Route exact path="/* link */">
        <Navbar />
        <Navigation link="menu" />
        <OuterMenu />
      </Route>
      {/*user home*/}
      <Route path="/* link */">
        <Navbar />
        <Home />
      </Route>
      {/*error page*/}
      <Route path="/* link */">
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
