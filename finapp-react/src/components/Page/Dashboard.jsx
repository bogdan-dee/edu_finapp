import React, {createContext, useContext, useState} from "react";
import {UserContext} from "../Container.jsx";
import CategoryList from "../Category/CategoryList.jsx";
import TransactionFormCreate from "../Transaction/TransactionFormCreate.jsx";
import useSWR from "swr";
import {fetcher} from "../App.jsx";
import TransactionList from "../Transaction/TransactionList.jsx";
import {buildAPIUrl, defaultSWROptions} from "../../functions/settings.js";
import AlertError from "../Alert/AlertError.jsx";

export const CategoriesContext = createContext();

function getListDateFilters(){
    return [
        'today',
        'yesterday',
        'this_week',
        'last_week',
        'this_month',
        'last_month'
    ]
}

function Dashboard(){
    const availableDateFilters = getListDateFilters();
    const user = useContext(UserContext);
    const APIUrl = buildAPIUrl('categories', {}, {user_id: user.id});
    const [dateFilter, setDateFilter] = useState(availableDateFilters[0]);
    const { data, error, isLoading, mutate } = useSWR(APIUrl, fetcher, defaultSWROptions);
    if (error) {
        return <AlertError message="Can not load categories from the server. Please refresh the page or try later."/>
    }

    console.log("RENDER DASHBOARD");


    const dateFilterView = availableDateFilters.map((v) => {
        return (
            <React.Fragment key={`date-filter-${v}`}>
                <input type="radio" className="btn-check" name="dateFilter" id={`date-filter-${v}`}
                       defaultChecked={(v === dateFilter)}
                       onChange={(e) => setDateFilter((_) => v)}
                />
                <label className="btn btn-outline-primary btn-sm text-capitalize" htmlFor={`date-filter-${v}`}>{v.replace('_', ' ')}</label>
            </React.Fragment>
        )
    });

    return (
        <CategoriesContext.Provider value={data}>
            <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 mb-4">
                    <h5>Add new incomes/expenses:</h5>
                    <hr/>
                    <TransactionFormCreate isCategoriesLoading={isLoading}/>
                </div>
                <div className="col mb-2">
                    <h5>Transactions history:</h5>
                    <hr/>
                    <div className="row">
                        <div className="col text-center">
                            <div id="dateFilter" className="btn-group" role="group">
                                {dateFilterView}
                            </div>
                        </div>
                    </div>
                    <TransactionList/>
                </div>
                <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12">
                    <h5>Manage categories (folders):</h5>
                    <hr/>
                    <CategoryList isCategoriesLoading={isLoading}/>
                </div>
            </div>
        </CategoriesContext.Provider>
    );
}

export default Dashboard;