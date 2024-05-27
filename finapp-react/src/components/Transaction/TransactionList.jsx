import React, {createContext, useContext, useEffect, useState} from "react";
import useSWRImmutable from "swr/immutable";
import useSWR, {mutate} from "swr";
import {fetcher} from "../App.jsx";
import Loading from "../Loading.jsx";
import {UserContext} from "../Container.jsx";
import {OPERATION_TYPE_EXPENSE, OPERATION_TYPE_INCOME} from "../../functions/operation_types_helper.js";
import TransactionFormEdit from "./TransactionFormEdit.jsx";
import {buildAPIUrl, defaultSWROptions, modalWindowIds} from "../../functions/settings.js";
import TransactionFormDelete from "./TransactionFormDelete.jsx";
import AlertNoRecords from "../Alert/AlertNoRecords.jsx";
import Transaction from "./Transaction.jsx";

export const TransactionsContext = createContext();

function getRand(){
    return Math.floor(Math.random() * 10000);
}

function calculateTotals(transactions) {
    let incomeAmounts = transactions.map((t) => (t.type === OPERATION_TYPE_INCOME ? t.amount : 0));
    let expenseAmounts = transactions.map((t) => (t.type === OPERATION_TYPE_EXPENSE ? t.amount : 0));

    let totalIncome = incomeAmounts.reduce((a, b) => a + b) || 0;
    let totalExpense = expenseAmounts.reduce((a, b) => a + b) || 0;

    return [
        Number(totalIncome).toFixed(2),
        Number(totalExpense).toFixed(2),
        Number(totalIncome - totalExpense).toFixed(2)
    ];
}

const emptyEditForm = {
    "id": 0,
    "type": null,
    "category": 0,
    "amount": 0,
    "datetime": null,
    "description": null
};


function TransactionList(){
    const user = useContext(UserContext);
    const [refreshToken, setRefreshToken] = useState(null);
    const [editFormState, setEditFormState] = useState(emptyEditForm);
    const [deleteModalState, setDeleteModalState] = useState(emptyEditForm);
    const [editModalBootstrap, setEditModalBootstrap] = useState(null);
    const [deleteModalBootstrap, setDeleteModalBootstrap] = useState(null);
    const APIUrl = buildAPIUrl('transactions', {}, {user_id: user.id});

    const {data, error, isLoading, isValidating} = useSWR(APIUrl, fetcher, {revalidateOnFocus: false});

    console.log("RENDERING TRANSACTIONS");

    useEffect(() => {
        if (refreshToken !== null) {
            mutate(APIUrl);
        }
    }, [refreshToken]); // refresh button

    // load bootstrap modal windows to be ready to put some data in them on click
    useEffect(() => {
        let elDelete = document.getElementById(modalWindowIds.transactionDelete);
        let elEdit = document.getElementById(modalWindowIds.transactionEdit);
        if (elDelete) {
            setDeleteModalBootstrap((_) => {
                return new bootstrap.Modal(document.getElementById(modalWindowIds.transactionDelete), {});
            });
        }
        if (elEdit) {
            setEditModalBootstrap((_) => {
                return new bootstrap.Modal(document.getElementById(modalWindowIds.transactionEdit), {});
            });
        }
    }, [data]);

    if (isLoading) {
        return <Loading message="Завантажуються транзакції..."/>;
    }
    if (Object.keys(data.data).length === 0) {
        if (isLoading || isValidating) {
            return <Loading message="Завантажуються транзакції..."/>;
        }
        return <AlertNoRecords message="В системі немає записів за обраний період."/>;
    }

    const totals = calculateTotals(data.data);
    const transactionsRowsView = data.data.map((t) => {
        return <Transaction
            key={`transaction-list-${t.id}`}
            transaction={t}
            deleteModalBootstrap={deleteModalBootstrap}
            setEditFormState={setEditFormState}
            editModalBootstrap={editModalBootstrap}
            setDeleteModalState={setDeleteModalState}
        />;
    });

    return (
        <>
            <div className="row mt-2 mb-3 fs-6 shadow-sm rounded">
                <div className="col-1 p-2 float-start text-start">
                    {isValidating ? (
                        <button className="btn btn-sm btn-outline-primary" type="button">
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </button>
                    ) : (
                        <button className="btn btn-sm btn-outline-primary" type="button"
                                onClick={(e) => setRefreshToken((prev) => getRand())}>
                            <i className="bi bi-arrow-clockwise"></i>
                        </button>
                    )}
                </div>
                <div className="col p-2 text-start">
                    Надходження: <span className="badge bg-success">{totals[0]}</span>
                </div>
                <div className="col p-2 text-center">
                    Витрати: <span className="badge bg-danger">{totals[1]}</span>
                </div>
                <div className="col p-2 text-end">
                    Баланс: <span className="badge bg-secondary">{totals[2]}</span>
                </div>
            </div>

            <div className="row">
                <div className="col table-responsive">
                    <table className="table table-sm align-middle caption-top">
                        <thead>
                        <tr className="table-dark">
                            <th scope="col">Час</th>
                            <th scope="col">Категорія</th>
                            <th scope="col">Сума</th>
                            <th scope="col">Опис</th>
                            <th scope="col" className="text-end pe-4"><i className="bi bi-gear"></i></th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactionsRowsView}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* mount modal windows with empty form in it by default*/}
            <TransactionsContext.Provider value={data}>
                <TransactionFormEdit
                    bootstrapModal={editModalBootstrap}
                    emptyForm={emptyEditForm}
                    formState={editFormState}
                    setFormState={setEditFormState}
                />
                <TransactionFormDelete
                    bootstrapModal={deleteModalBootstrap}
                    transaction={deleteModalState}
                />
            </TransactionsContext.Provider>
        </>
    );
}

export default TransactionList