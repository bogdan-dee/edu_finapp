import React, {useContext, useState} from "react";
import axios from "axios";
import {mutate} from "swr";
import {getOperationTypes, getOperationTypesNames} from "../../functions/operation_types_helper.js";
import {UserContext} from "../Container.jsx";
import {CategoriesContext} from "../Page/Dashboard.jsx";
import {showToastError, showToastSuccess} from "../../functions/toast.js";
import {buildAPIUrl} from "../../functions/settings.js";

function CategoryFormCreate(){
    const user = useContext(UserContext);
    const categories = useContext(CategoriesContext);

    const emptyForm = {
       name: '',
       type: null
    };
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formState, setFormState] = useState(emptyForm);

    function handleFormSubmit(e){
        e.preventDefault();
        console.log(formState);
        setIsSaving((prev) => true);
        const APIUrl = buildAPIUrl('categories', {}, {user_id: user.id});
        axios.post(APIUrl, formState).then((response) => {
            console.log(response);
            if (response.status === 201 && parseInt(response.data.meta.inserted) === 1) {
                categories.data.push(response.data.data);
                mutate(APIUrl, { ...categories, categories});
                showToastSuccess('New category has been created.');
            } else {
                showToastError('Error occurred while creating new category.');
            }
        }).catch((error) => {
            // TODO: add error handling
            console.log(error);
            showToastError('Error occurred while creating new category.');
        }).finally(() => {
            setIsSaving((prev) => false);
            setFormState((prev) => emptyForm);
        });
    }

    function handleFormChange(e) {
        const form = {...formState,
            [e.target.name]: e.target.value
        };
        setFormState((prev) => form);
    }

    const operationTypes = getOperationTypes();
    const operationTypesNames = getOperationTypesNames();
    const operationTypesRadioButtons = operationTypes.map((operationType, index) => {
        return (
            <div className="optype_radio_btn"
                 key={`add-cat-operation-${operationType}`}>
                <input type="radio" name="type" id={`add-cat-operation-${operationType}`}
                       value={operationType}
                       required={index === 0}
                       checked={parseInt(operationType) === parseInt(formState.type)}
                       onChange={handleFormChange}
                />
                <label className="text-uppercase" htmlFor={`add-cat-operation-${operationType}`}>
                    {operationTypesNames[index]}
                </label>
            </div>
        );
    });

    return (
        <>
            {isCreateFormOpen ? (
                <form onSubmit={handleFormSubmit}>
                    <div className="clearfix">
                        <div className="text-center small mb-1">Choose operation type for new category:</div>
                        {operationTypesRadioButtons}
                    </div>

                    <div className="mt-1 mb-2">
                    <input className="form-control form-control-sm" type="text" name="name"
                               onChange={handleFormChange}
                               placeholder="Category name" value={formState.name || ''} required/>
                    </div>
                    <div className="mb-0">
                        { isSaving ? (
                            <button type="submit" className="btn btn-sm btn-dark" disabled>
                                <span className="spinner-border spinner-border-sm" role="status"
                                      aria-hidden="true"></span>
                                <span>Saving...</span>
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-sm btn-dark">Create</button>
                        )}

                        <button type="button" className="btn btn-sm btn-secondary float-end"
                                onClick={() => {setIsCreateFormOpen(false); setFormState((_) => emptyForm)}}
                        >Close
                        </button>
                    </div>
                </form>
            ) : (
                <div className="d-grid text-center pt-2">
                    <button type="button" className="btn btn-sm btn-dark"
                            onClick={() => setIsCreateFormOpen((_) => true)}>
                        <i className="bi bi-pencil-square"></i> Add new category
                    </button>
                </div>
            ) }
        </>
    );
}

export default CategoryFormCreate;