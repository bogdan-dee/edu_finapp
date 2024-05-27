import {OPERATION_TYPE_EXPENSE, OPERATION_TYPE_INCOME} from "../../functions/operation_types_helper.js";
import React from "react";

function Transaction({transaction, setEditFormState, setDeleteModalState, deleteModalBootstrap, editModalBootstrap}){

    function handleOpenEditModal(){
        setEditFormState((prev) => transaction);
        editModalBootstrap.show();
    }

    function handleOpenDeleteModal(){
        setDeleteModalState((prev) => transaction);
        deleteModalBootstrap.show();
    }

    // highlight income rows in table
    let className = null;
    if (transaction.type === OPERATION_TYPE_INCOME) {
        className = 'table-success';
    }

    // show only time for today's records
    let datetime = new Date(transaction.datetime).toLocaleString('en-GB').replace(",", "\n");
    if (new Date().toLocaleDateString() === new Date(transaction.datetime).toLocaleDateString()) {
        datetime = new Date(transaction.datetime).toLocaleTimeString('en-GB');
    }

    return (
        <tr key={`transaction-list-${transaction.id}`} className={className}>
            <td className="white-space">{datetime}</td>
            <td>{transaction.category_name}</td>
            <td>{(transaction.type === OPERATION_TYPE_EXPENSE ? '-' : '')}{transaction.amount}</td>
            <td>{transaction.description}</td>
            <td title={`ID: ${transaction.id}`} className="text-end">
                <button type="button" className="btn btn-sm"
                        onClick={handleOpenEditModal}>
                    <i className="bi bi-pencil"></i>
                </button>
                <button type="button" className="btn btn-sm"
                        onClick={handleOpenDeleteModal}>
                    <i className="bi bi-trash"></i></button>
            </td>
        </tr>
    );
}

export default Transaction;