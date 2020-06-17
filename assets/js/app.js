import React, { useState } from "react";
import ReactDom from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./contexts/AuthContext";
import CustomersPage from "./pages/CustomersPage";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthApi from "./services/authApi";
import CustomerPage from "./pages/CustomerPage";
import InvoicePage from "./pages/InvoicePage";
import RegisterPage from "./pages/RegisterPage";
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
require ("../css/app.css");

AuthApi.setup();


// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log('Hello Webpack Encore! Edit me in assets/js/app.js');

const App = () => {

// Il faudrait par defaut qu'on demande a Authapi si on est connecté ou pas.
    const [isAuthenticated, setIsAuthenticated] = useState(
    AuthApi.isAuthenticated()
  );

  const NavbarWithRouter =  withRouter(Navbar);


    return ( 
          /* Le HashRouter me permet de dire qu'on reste sur la meme page mais avec un element different  #/customers ou #/invoices ,etc...*/
        /*  C'est le switch qui joue le rôle du router */
        <AuthContext.Provider value= { {
            isAuthenticated,
            setIsAuthenticated
        } }>
            <HashRouter>
                <NavbarWithRouter />
                <main className="container pt-5">
                    <Switch>
                        <Route path="/login"  component= { LoginPage }/>
                        <Route path="/register"  component= { RegisterPage }/>
                        <PrivateRoute path="/customers/:id"  component={ CustomerPage } />
                        <PrivateRoute path="/customers"  component={ CustomersPage } />
                        <PrivateRoute path="/invoices/:id" component = { InvoicePage }/>
                        <PrivateRoute path="/invoices" component = { InvoicesPage }/>
                        <Route path="/" component= { HomePage }/>
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
};

const rootElement =  document.querySelector("#app");
ReactDom.render(<App />, rootElement);