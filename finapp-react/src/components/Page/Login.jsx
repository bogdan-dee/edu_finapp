import React, {useState} from "react";
import axios from "axios";
import useSWR from 'swr'
import {fetcher} from "../App.jsx";
import Loading from "../Loading.jsx";
import {buildAPIUrl, defaultSWROptions} from "../../functions/settings.js";
import AlertError from "../Alert/AlertError.jsx";

function Login(){
    const [userId, setUserId] = useState(null);
    const APIUrl = buildAPIUrl('users');
    const { data, error, isLoading } = useSWR(APIUrl, fetcher, defaultSWROptions);

    if (error) {
        return <AlertError message="Не можу завантажити список доступних облікових записів з сервера."/>;
    }
    if (isLoading) {
        return <Loading />;
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        localStorage.setItem('user_id', JSON.stringify(userId));
        window.location.reload();
    }

    const usersList = data.data; //parsing from API response
    const listItems = usersList.map(user => <option value={user.id} key={user.id}>{user.username}</option>)
    return (
        <div className="row">
            <div className="col"></div>
            <div className="col">
                <form onSubmit={handleFormSubmit}>
                    <h1 className="fs-4">Виберіть обліковий запис:</h1>
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        name="user_id"
                        required={true}
                        defaultValue=""
                        onChange={(e) => (setUserId((prev) => (e.target.value)))}
                    >
                        <option value="">виберіть акаунт зі списку</option>
                        {listItems}
                    </select>
                    <div className="d-grid gap-2 mt-1">
                        <button id="sign-in-btn" className="btn btn-primary" type="submit">Увійти</button>
                    </div>
                </form>
            </div>
            <div className="col"></div>
        </div>
    );
}

export default Login;