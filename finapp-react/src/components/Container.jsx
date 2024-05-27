import React, {createContext, useState} from "react";
import useSWR from 'swr';
import {fetcher} from "./App.jsx";
import Login from "./Page/Login.jsx";
import Dashboard from "./Page/Dashboard.jsx";
import Navbar from "./Navbar.jsx";
import AlertError from "./Alert/AlertError.jsx";
import Footer from "./Footer.jsx";
import {buildAPIUrl, defaultSWROptions} from "../functions/settings.js";
import {showToastError} from "../functions/toast.js";
import Loading from "./Loading.jsx";

export const UserContext = createContext();

function Container(){
    let localStorageUserId = JSON.parse(localStorage.getItem('user_id'));
    if (localStorageUserId) {
        let APIUrl = buildAPIUrl('user', {id: localStorageUserId});
        const { data, error, isLoading} = useSWR(APIUrl, fetcher, defaultSWROptions);

        if (error) {
            localStorage.setItem('user_id', JSON.stringify(null));
            showToastError("Authentication error");
            return <AlertError message="Can not load profile from the server. Please refresh the page."/>
        }
        if (isLoading) {
            return <Loading/>
        }

        console.log("RENDER CONTAINER");

        return (
            <>
                <Navbar user={data.data}/>
                <section>
                    <div className="container-fluid">
                        <UserContext.Provider value={data.data}>
                            <Dashboard/>
                        </UserContext.Provider>
                    </div>
                </section>
                <Footer/>
            </>
        );
    } else {
        return (
            <>
                <Navbar user={null}/>
                <section>
                    <div className="container-fluid">
                        <Login/>
                    </div>
                </section>
                <Footer/>
            </>
        );
    }
}

export default Container;