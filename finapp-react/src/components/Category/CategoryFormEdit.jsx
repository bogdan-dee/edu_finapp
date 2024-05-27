import React, {useContext, useEffect, useState} from "react";
import {getOperationTypes, getOperationTypesNames} from "../../functions/operation_types_helper.js";
import {CategoriesContext} from "../Page/Dashboard.jsx";
import axios from "axios";
import {mutate} from "swr";
import {UserContext} from "../Container.jsx";
import ModalEdit from "../Modal/ModalEdit.jsx";
import {buildAPIUrl, modalWindowIds} from "../../functions/settings.js";
import {showToastError, showToastSuccess} from "../../functions/toast.js";

function CategoryFormEdit({bootstrapModal, emptyForm, formState, setFormState}) {
    const user = useContext(UserContext);
    const categories = useContext(CategoriesContext);
    const [isSaving, setIsSaving] = useState(false);

    // unblock button after closing the modal window
    useEffect(() => {
        const modal = document.getElementById(modalWindowIds.categoryEdit);
        modal.addEventListener('hidden.bs.modal', event => {
            setIsSaving((prev) => false);
        });
    }, []);

    function handleChangeEditForm(e) {
        let key = e.target.name;
        let value = e.target.value;

        setFormState((prev) => ({...prev, [key]: value}));
    }

    function handleSubmitEditForm(e) {
        e.preventDefault();
        const APIUrlList = buildAPIUrl('categories', {}, {user_id: user.id});
        const APIUrlUpdate = buildAPIUrl('category', {id: formState.id}, {user_id: user.id});

        const formData = {
            type: formState.type,
            name: formState.name
        };
        console.log(formData);
        setIsSaving((prev) => true);
        axios.put(APIUrlUpdate, formData).then((response) => {
            console.log(response);
            if (response.status === 200) {
                mutate(APIUrlList, () => {
                        let categoriesList = categories.data.map(t => ({...t}));
                        let tIndex = categoriesList.findIndex(t => t.id === formState.id);
                        categoriesList[tIndex] = response.data.data;
                        return { ...categories, data: categoriesList};
                    }
                );
                showToastSuccess('Дані про категорію успішно оновлені.');
                mutate(buildAPIUrl('transactions', {}, {user_id: user.id}));
            } else {
                showToastError('Виникла помилка під час оновлення категорії.');
            }
        }).catch((error) => {
            // TODO: add error handling
            console.log(error);
            showToastError('Виникла помилка під час оновлення категорії.');
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
            <option key={`edit-category-operation-${operationType}`} value={operationType}>
                {operationTypesNames[index].replace('income', 'дохід').replace('expense', 'витрати')}
            </option>
        );
    });

    const editFormView =
        <form onSubmit={handleSubmitEditForm} id={`form-${modalWindowIds.categoryEdit}`}>
            <div className="mb-1">
                <select className="form-select text-uppercase" id="edit-type" name="type"
                        onChange={handleChangeEditForm} value={formState.type || ''}>
                    {optionsForOperationType}
                </select>
            </div>
            <div className="mb-1">
                <input type="text" className="form-control" id="edit-name" name="name"
                       required placeholder="Назва категорії" value={formState.name || ''}
                       onChange={handleChangeEditForm}/>
            </div>
        </form>;

    return <ModalEdit
        modalId={modalWindowIds.categoryEdit}
        modalTitle={`Редагувати категорію з ID: ${formState.id}`}
        modalBody={editFormView}
        formId={`form-${modalWindowIds.categoryEdit}`}
        isFormSaving={isSaving}
    />
}

export default CategoryFormEdit;