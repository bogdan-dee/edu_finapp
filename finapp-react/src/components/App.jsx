import React, {Suspense, useEffect} from "react";
import Container from "./Container.jsx";
import axios from "axios";
import Loading from "./Loading.jsx";
import ToastSuccess from "./Toast/ToastSuccess.jsx";
import ToastError from "./Toast/ToastError.jsx";
import {createToastError, createToastSuccess} from "../functions/toast.js";

export const fetcher = url => axios.get(url).then(res => res.data);

function App() {
    useEffect(() => {
        createToastSuccess();
        createToastError();
    }, []);

    return(
        <>
            <Suspense fallback={<Loading message="Завантажується..."/>}>
                <Container/>
            </Suspense>

            <div className="toast-container bottom-0 end-0 mb-5">
                <ToastSuccess/>
                <ToastError/>
            </div>
        </>
    );
}

export default App
