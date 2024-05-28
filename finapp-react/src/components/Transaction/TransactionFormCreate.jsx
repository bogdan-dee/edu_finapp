import React, {useContext, useRef, useState} from "react";
import {
    getOperationTypes,
    getOperationTypesNames,
    OPERATION_TYPE_EXPENSE
} from "../../functions/operation_types_helper.js";
import Loading from "../Loading.jsx";
import {CategoriesContext} from "../Page/Dashboard.jsx";
import axios from "axios";
import {mutate} from "swr";
import {buildAPIUrl} from "../../functions/settings.js";
import {UserContext} from "../Container.jsx";
import {showToastError, showToastSuccess} from "../../functions/toast.js";
import AlertNoRecords from "../Alert/AlertNoRecords.jsx";

function TransactionFormCreate({isCategoriesLoading}){
    if (isCategoriesLoading) {
        return <Loading message="Завантажується форма..."/>
    }

    /** state **/
    const user = useContext(UserContext);
    const categories = useContext(CategoriesContext);
    const emptyForm = {
        type: OPERATION_TYPE_EXPENSE,
        category: null,
        amount: null,
        description: ''
    };
    const [formState, setFormState] = useState(emptyForm);
    const [isSaving, setIsSaving] = useState(false);
    const amountInputRef = useRef(null);

    // handling no categories
    if (Object.keys(categories.data).length === 0) {
        return <AlertNoRecords message="Створіть свою першу категорію, щоб почати працювати з додатком."/>
    }

    /** handlers **/
    function handleFormChange(e) {
        setFormState((prev) => ({...prev,
            [e.target.name]: e.target.value
        }));

        // force reset chosen category when switching operation type
        if (e.target.name === 'type') {
            setFormState((prev) => ({...prev,
                category: null
            }));
        }

        // focus on amount input field after choosing a category
        if (e.target.name === 'category' && !isSaving && e.target.value > 0) {
            amountInputRef.current.focus();
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        console.log(formState);
        if (! formState.category) {
            showToastError('Ви ПОВИННІ вказати катагерію при створенні транзакції. Додайте категорію, якщо таких ще нема :)');
            return;
        }

        const APIUrl = buildAPIUrl('transactions', {}, {user_id: user.id});
        const APIUrlCategories = buildAPIUrl('categories', {}, {user_id: user.id});
        setIsSaving((prev) => true);
        axios.post(APIUrl, formState).then((response) => {
            console.log(response);
            if (response.status === 201 && parseInt(response.data.meta.inserted) === 1) {
                if (document.getElementById('date-filter-today').checked) {
                    mutate(APIUrl); // reload component with transactions list
                } else {
                    // switch to the first tab in the date filter
                    document.getElementById('date-filter-today').click();
                }
                mutate(APIUrlCategories); // reload component with categories list
                showToastSuccess('Запис успішно додано.');
            } else {
                showToastError('Виникла помилка під час створення нового запису.');
            }
        }).catch((error) => {
            // TODO: add error handling
            showToastError('Виникла помилка під час створення нового запису.');
            console.log(error);
        }).finally(() => {
            setIsSaving((prev) => false);
            setFormState((prev) => emptyForm);
            amountInputRef.current.blur();
        });
    }

    /** views **/
    const operationTypes = getOperationTypes();
    const operationTypesNames = getOperationTypesNames();
    let groupedCategories = operationTypes.map((_) => []);
    operationTypes.map((operationType, index) => {
        groupedCategories[index] = categories.data.filter((cat) => cat.type === operationType);
    });

    const operationTypesRadioButtonsView = operationTypes.map((operationType, index) => {
        return (
            <div className="optype_radio_btn" key={`add-transaction-operation-${operationType}`}>
                <input type="radio" name="type" id={`add-transaction-operation-${operationType}`}
                       value={operationType} required
                       checked={(parseInt(operationType) === parseInt(formState.type))}
                       onChange={handleFormChange}
                />
                <label className="text-uppercase" htmlFor={`add-transaction-operation-${operationType}`}>
                    {operationTypesNames[index].replace('income', 'дохід').replace('expense', 'витрати')}
                </label>
            </div>
        );
    });

    const categoriesView = groupedCategories.map((categories, index) => {
        return groupedCategories[index].map(
            (cat, catIndex) => (
                <div className="cat_radio_btn" key={`add-transaction-cat-${cat.id}`}>
                    <input type="radio" id={`add-transaction-cat-radio-${cat.id}`} name="category" value={cat.id}
                           checked={(parseInt(cat.id) === parseInt(formState.category))}
                           required={(catIndex === 0)}
                           onChange={handleFormChange}/>
                    <label htmlFor={`add-transaction-cat-radio-${cat.id}`}>
                        <i className="bi bi-arrow-right-short"></i> {cat.name}
                    </label>
                </div>
            )
        );
    });

    return (
        <div>
            <form onSubmit={(e) => handleFormSubmit(e)}>
                <div className="operation_types clearfix p-2 pt-0 mb-2 text-center">
                    <div className="text-center small mb-1">Виберіть тип операції:</div>
                    {operationTypesRadioButtonsView}
                </div>

                <div className="cat_radio_widget mb-2">
                    {categoriesView[operationTypes.indexOf(parseInt(formState.type))]}
                </div>


                <div className="mb-1">
                    <input type="number" className="form-control" id="add-amount" name="amount"
                           min="0.01" step="0.01" max="10000000"
                           required placeholder="Скільки ?" value={formState.amount || ''}
                           onChange={handleFormChange} ref={amountInputRef}/>
                </div>
                <div className="mb-2">
                        <textarea className="form-control" id="add-description" name="description"
                                  rows="2" placeholder="Короткий опис" value={formState.description || ''}
                                  onChange={handleFormChange}>
                        </textarea>
                </div>

                <div className="mb-1 d-grid gap-1">
                    { isSaving ? (
                        <button type="submit" className="btn btn-dark text-uppercase" disabled>
                                <span className="spinner-border spinner-border-sm" role="status"
                                      aria-hidden="true"></span>
                            <span>Зберігається...</span>
                        </button>
                    ) : (
                        <button className="btn btn-dark text-uppercase" type="submit">Створити транзакцію</button>
                    )}
                    <button className="btn btn-outline-secondary" type="button"
                            onClick={(e) => setFormState((prev) => emptyForm)}>
                        Очистити форму
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TransactionFormCreate;