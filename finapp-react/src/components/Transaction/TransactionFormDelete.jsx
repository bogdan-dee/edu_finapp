import React, {useCallback, useContext, useEffect, useState} from "react";
import axios from "axios";
import {mutate} from "swr";
import {UserContext} from "../Container.jsx";
import {buildAPIUrl, modalWindowIds} from "../../functions/settings.js";
import ModalDelete from "../Modal/ModalDelete.jsx";
import {TransactionsContext} from "./TransactionList.jsx";
import {showToastError, showToastSuccess} from "../../functions/toast.js";
import {OPERATION_TYPE_EXPENSE} from "../../functions/operation_types_helper.js";

function TransactionFormDelete({bootstrapModal, transaction}) {
    const user = useContext(UserContext);
    const transactions = useContext(TransactionsContext);
    const [isDeleting, setIsDeleting] = useState(false);

    // unblock button after closing the modal window
    useEffect(() => {
        const modal = document.getElementById(modalWindowIds.transactionDelete);
        modal.addEventListener('hidden.bs.modal', event => {
            setIsDeleting((prev) => false);
        });
    }, []);

    const handleDelete = useCallback(() => {
        const APIUrlList = buildAPIUrl('transactions', {}, {user_id: user.id});
        const APIUrlDelete = buildAPIUrl('transaction', {id: transaction.id}, {user_id: user.id});
        const APIUrlCategories = buildAPIUrl('categories', {}, {user_id: user.id});
        setIsDeleting((prev) => true);

        axios.delete(APIUrlDelete).then((response) => {
            console.log(response);
            if (response.status === 200 && parseInt(response.data.meta.deleted) === 1) {
                // filter out the deleted entity and update the state through SWR mutate function
                mutate(APIUrlList, () => {
                        let transactionsList = transactions.data.map(a => ({...a}));
                        let tIndex = transactionsList.findIndex(t => t.id === transaction.id);
                        transactionsList.splice(tIndex, 1);
                        return { ...transactions, data: transactionsList};
                    }
                );
                showToastSuccess('Transaction has been deleted.');
                mutate(APIUrlCategories); // reload component with categories list
            } else {
                showToastError('Error occurred while deleting the transaction.');
            }
        }).catch((error) => {
            // TODO: add error handling
            console.log(error);
            showToastError('Error occurred while deleting the transaction.');
        }).finally(() => {
            setIsDeleting((prev) => false);
            bootstrapModal.hide();
        })
    }, [transaction]);

    const deleteView = <div className="text-danger">
        Please, confirm you want to delete transaction with amount:
        <b> {parseInt(OPERATION_TYPE_EXPENSE) === parseInt(transaction.type) ? '-' : ''}{transaction.amount}</b>
    </div>;

    return <ModalDelete
        modalId={modalWindowIds.transactionDelete}
        modalTitle={`Delete Transaction ID: ${transaction.id}`}
        modalBody={deleteView}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
    />
}

export default TransactionFormDelete;