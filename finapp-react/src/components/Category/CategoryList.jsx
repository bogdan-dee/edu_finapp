import React, {useContext, useEffect, useState} from "react";

import Loading from "../Loading.jsx";
import Category from "./Category.jsx";
import CategoryFormCreate from "./CategoryFormCreate.jsx";
import {getOperationTypes, getOperationTypesNames, OPERATION_TYPE_INCOME} from "../../functions/operation_types_helper.js";
import {CategoriesContext} from "../Page/Dashboard.jsx";
import AlertNoRecords from "../Alert/AlertNoRecords.jsx";
import CategoryFormDelete from "./CategoryFormDelete.jsx";
import CategoryFormEdit from "./CategoryFormEdit.jsx";
import {modalWindowIds} from "../../functions/settings.js";


const emptyEditForm = {
    "id": 0,
    "type": null,
    "name": null,
    "transactions_count": 0
};

function CategoryList({isCategoriesLoading}){
    const categories = useContext(CategoriesContext);
    const [activeTypeTab, setActiveTypeTab] = useState(OPERATION_TYPE_INCOME);
    const [editModalState, setEditModalState] = useState(emptyEditForm);
    const [deleteModalState, setDeleteModalState] = useState(emptyEditForm);
    const [editModalBootstrap, setEditModalBootstrap] = useState(null);
    const [deleteModalBootstrap, setDeleteModalBootstrap] = useState(null);

    // load bootstrap modal windows to be ready to put some data in them on click
    useEffect(() => {
        if (! isCategoriesLoading) {
            setDeleteModalBootstrap((_) => {
                return new bootstrap.Modal(document.getElementById(modalWindowIds.categoryDelete), {});
            });
            setEditModalBootstrap((_) => {
                return new bootstrap.Modal(document.getElementById(modalWindowIds.categoryEdit), {});
            });
        }
    }, [isCategoriesLoading]);


    if (isCategoriesLoading) {
        return <Loading message="завантажуються категорії..."/>
    }

    const operationTypes = getOperationTypes();
    const operationTypesNames = getOperationTypesNames();
    // we group the categories list by the operation types e.g. income/expense, etc.
    let groupedCategories = operationTypes.map((_) => []);
    operationTypes.map((operationType, index) => {
        groupedCategories[index] = categories.data.filter((cat) => cat.type === operationType);
    });
    const categoriesView = groupedCategories.map((categories, index) => {
        if (groupedCategories[index].length === 0) {
            return <AlertNoRecords/>;
        }

        return groupedCategories[index].map(
            cat => <Category
                key={`cat-list-${cat.id}`}
                category={cat}
                deleteModalBootstrap={deleteModalBootstrap}
                setDeleteModalState={setDeleteModalState}
                editModalBootstrap={editModalBootstrap}
                setEditModalState={setEditModalState}
            />
        );
    });

    const categoriesTabsViewNavView = operationTypes.map((operationType, index) => {
        return (
            <li key={`tab-nav-${operationType}`} className="nav-item" role="presentation">
                <button className={"nav-link text-uppercase" + (activeTypeTab === operationType ? " active" : "")}
                        data-bs-toggle="tab" data-bs-target={`#tab-pane-operation-${operationType}`} type="button" role="tab"
                        aria-controls={`tab-pane-operation-${operationType}`} aria-selected="true"
                        onClick={(e) => setActiveTypeTab((prev) => operationType)}
                >{operationTypesNames[index].replace('income', 'дохід').replace('expense', 'витрати')}
                </button>
            </li>
        )
    });

    const categoriesTabsView = operationTypes.map((operationType, index) => {
        return (
            <div key={`tab-${operationType}`} className={"tab-pane fade" + (activeTypeTab === operationType ? " show active" : "")}
                 id={`tab-pane-operation-${operationType}`} role="tabpanel"
                 tabIndex="0">{categoriesView[index]}
            </div>
        )
    });

    return (
        <>
            <div className="categories_list mb-2">
                <ul className="nav nav-tabs" id="category-tabs-nav" role="tablist">
                    {categoriesTabsViewNavView}
                </ul>
                <div className="tab-content" id="category-tabs-content">
                    {categoriesTabsView}
                </div>
            </div>
            <div className="categories_form_container p-2 pt-0">
                <CategoryFormCreate/>
            </div>

            <CategoryFormEdit
                bootstrapModal={editModalBootstrap}
                emptyForm={emptyEditForm}
                formState={editModalState}
                setFormState={setEditModalState}
            />
            <CategoryFormDelete
                bootstrapModal={deleteModalBootstrap}
                category={deleteModalState}
            />
        </>
    );
}

export default CategoryList;