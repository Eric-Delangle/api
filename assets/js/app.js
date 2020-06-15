import React from "react";
import ReactDom from "react-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route } from "react-router-dom"
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthApi from "./services/authApi";
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
    return ( 
        /* Le HashRouter me permet de dire qu'on reste sur la meme page mais avec un element different  #/customers ou #/invoices ,etc...*/
        /*  C'est le switch qui joue le rôle du router */
        <HashRouter>
            <Navbar />
            <main className="container pt-5">
                <Switch>
                    <Route path="/login" component = { LoginPage }/>
                    <Route path="/customers" component = { CustomersPage }/>
                    <Route path="/invoices" component = { InvoicesPage }/>
                    <Route path="/" component= { HomePage }/>
                </Switch>
            </main>
        </HashRouter>
    );
};

const rootElement =  document.querySelector("#app");
ReactDom.render(<App />, rootElement);