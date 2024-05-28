import React, {useContext, useEffect, useState} from "react";
import {getOperationTypes, getOperationTypesNames} from "../../functions/operation_types_helper.js";
import {CategoriesContext} from "../Page/Dashboard.jsx";
import axios from "axios";
import {mutate} from "swr";
import {UserContext} from "../Container.jsx";
import ModalEdit from "../Modal/ModalEdit.jsx";
import {buildAPIUrl, modalWindowIds} from "../../functions/settings.js";
import {TransactionsContext} from "./TransactionList.jsx";
import {showToastError, showToastSuccess} from "../../functions/toast.js";

function TransactionFormEdit({bootstrapModal, emptyForm, formState, setFormState}) {
    const user = useContext(UserContext);
    const categories = useContext(CategoriesContext);
    const transactions = useContext(TransactionsContext);
    const [isSaving, setIsSaving] = useState(false);

    // unblock button after closing the modal window
    useEffect(() => {
        const modal = document.getElementById(modalWindowIds.transactionEdit);
        modal.addEventListener('hidden.bs.modal', event => {
            setIsSaving((prev) => false);
        });
    }, []);

    function handleChangeEditForm(e) {
        let key = e.target.name;
        let value = e.target.value;

        if (key === 'date' || key === 'time') { // handle datetime change properly
            key = 'datetime';
            value = document.getElementById('edit-date').value + 'T' + document.getElementById('edit-time').value + ':00';
        }
        setFormState((prev) => ({...prev, [key]: value}));

        // force to reload categories based on changed operation type
        if (key === 'type') {
            setFormState((prev) => ({...prev, category: 0}));
        }
    }

    function handleSubmitEditForm(e) {
        e.preventDefault();
        const APIUrlList = buildAPIUrl('transactions', {}, {user_id: user.id});
        const APIUrlUpdate = buildAPIUrl('transaction', {id: formState.id}, {user_id: user.id});

        let formData = Object.assign({}, formState); // cloning from state to make changes to the object
        delete formData['id'];
        delete formData['user_id'];
        delete formData['type'];
        delete formData['category_name'];
        delete formData['created_at'];
        delete formData['updated_at'];

        const date = new Date(formData.datetime);
        const localDate = date.getFullYear() + '-' + date.toLocaleDateString('uk-GB').slice(3, 5) + '-' + date.toLocaleDateString('uk-GB').slice(0, 2);
        const localTime = date.toLocaleTimeString('uk-GB').slice(0, 5)
        formData['datetime'] = localDate + ' ' + localTime;
        formData['timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;

        console.log(formData);
        setIsSaving((prev) => true);
        axios.put(APIUrlUpdate, formData).then((response) => {
            console.log(response);
            if (response.status === 200) {
                mutate(APIUrlList, () => {
                        let transactionsList = transactions.data.map(t => ({...t}));
                        let tIndex = transactionsList.findIndex(t => t.id === formState.id);
                        transactionsList[tIndex] = response.data.data;
                        return { ...transactions, data: transactionsList};
                    }
                );
                showToastSuccess('Дані про транзакцію успішно оновлено.');
            } else {
                showToastError('Виникла помилка під час збереження транзакції.');
            }
        }).catch((error) => {
            // TODO: add error handling
            console.log(error);
            showToastError('Виникла помилка під час збереження транзакції.');
        }).finally(() => {
            setIsSaving((_) => false);
            bootstrapModal.hide();
            setFormState((_) => emptyForm);
        });
    }

    const operationTypes = getOperationTypes();
    const operationTypesNames = getOperationTypesNames();
    const optionsForOperationType = operationTypes.map((operationType, index) => {
        return (
            <option key={`edit-transaction-operation-${operationType}`} value={operationType}>
                {operationTypesNames[index].replace('income', 'дохід').replace('expense', 'витрати')}
            </option>
        );
    });

    let categoriesList = [];
    if (categories!==undefined && categories.data !== undefined) {
        categoriesList = categories.data;
    }
    const optionsForCategory = categoriesList.map((cat) => {
        if (parseInt(cat.type) === parseInt(formState.type)) {
            return (
                <option key={`edit-transaction-category-${cat.id}`} value={cat.id}>
                    {cat.name}
                </option>
            );
        }
    });

    // format the date and time for the corresponding fields in the edit form
    const date = new Date(formState.datetime);
    const localDate = date.getFullYear() + '-' + date.toLocaleDateString('uk-GB').slice(3, 5) + '-' + date.toLocaleDateString('uk-GB').slice(0, 2);
    const localTime = date.toLocaleTimeString('uk-GB').slice(0, 5);
    const editFormView =
        <form onSubmit={handleSubmitEditForm} id={`form-${modalWindowIds.transactionEdit}`}>
            <div className="mb-1">
                <select className="form-select text-uppercase" id="edit-type" name="type"
                        onChange={handleChangeEditForm} value={formState.type || ''}>
                    {optionsForOperationType}
                </select>
            </div>
            <div className="mb-1">
                <select className="form-select" id="edit-category" name="category" required={true}
                        onChange={handleChangeEditForm} value={formState.category || ''}>
                    <option value="">Select Category</option>
                    {optionsForCategory}
                </select>
            </div>
            <div className="mb-1">
                <input type="date" className="form-control mb-1" id="edit-date" name="date"
                       required value={localDate || ''}
                       onChange={handleChangeEditForm}/>

                <input type="time" className="form-control" id="edit-time" name="time"
                       required value={localTime || ''}
                       onChange={handleChangeEditForm}/>
            </div>
            <div className="mb-1">
                <input type="number" className="form-control" id="edit-amount" name="amount"
                       min="0.01" step="0.01" max="10000000"
                       required placeholder="Скільки ?" value={formState.amount || ''}
                       onChange={handleChangeEditForm}/>
            </div>
            <div className="mb-1">
                <textarea className="form-control" id="edit-description" name="description"
                          rows="2" placeholder="Короткий опис" value={formState.description || ''}
                          onChange={handleChangeEditForm}>
                </textarea>
            </div>
        </form>;

    return <ModalEdit
        modalId={modalWindowIds.transactionEdit}
        modalTitle={`Редагування транзакції з ID: ${formState.id}`}
        modalBody={editFormView}
        formId={`form-${modalWindowIds.transactionEdit}`}
        isFormSaving={isSaving}
    />
}

export default TransactionFormEdit;