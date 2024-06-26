import React, {useCallback, useContext, useEffect, useState} from "react";
import axios from "axios";
import {mutate} from "swr";
import {UserContext} from "../Container.jsx";
import {buildAPIUrl, modalWindowIds} from "../../functions/settings.js";
import ModalDelete from "../Modal/ModalDelete.jsx";
import {showToastError, showToastSuccess} from "../../functions/toast.js";
import {CategoriesContext} from "../Page/Dashboard.jsx";

function CategoryFormDelete({bootstrapModal, category}) {
    const user = useContext(UserContext);
    const categories = useContext(CategoriesContext);
    const [isDeleting, setIsDeleting] = useState(false);

    // unblock button after closing the modal window
    useEffect(() => {
        const modal = document.getElementById(modalWindowIds.categoryDelete);
        modal.addEventListener('hidden.bs.modal', event => {
            setIsDeleting((prev) => false);
        });
    }, []);

    const handleDelete = useCallback(() => {
        const APIUrlList = buildAPIUrl('categories', {}, {user_id: user.id});
        const APIUrlDelete = buildAPIUrl('category', {id: category.id}, {user_id: user.id});
        setIsDeleting((prev) => true);

        axios.delete(APIUrlDelete).then((response) => {
            console.log(response);
            if (response.status === 200 && parseInt(response.data.meta.deleted) === 1) {
                // filter out the deleted entity and update the state through SWR mutate function
                mutate(APIUrlList, () => {
                    const updatedList = categories.data.filter((c) => {
                        return (c.id !== category.id);
                    });
                    return { ...categories, data: updatedList};
                });
                showToastSuccess('Категорію успішно видалено.');
                mutate(buildAPIUrl('transactions', {}, {user_id: user.id}));
            } else {
                showToastError('Виникла помилка під час видалення категорії.');
            }
        }).catch((error) => {
            // TODO: add error handling
            console.log(error);
            showToastError('Виникла помилка під час видалення категорії.');
        }).finally(() => {
            setIsDeleting((prev) => false);
            bootstrapModal.hide();
        })
    }, [category]);

    const deleteView = <>
        {category.transactions_count > 0 ? (
            <div className="text-center mb-2">
                <strong>УВАГА!</strong> Додатково буде видалено <span className="badge text-bg-danger">{category.transactions_count}</span> транзакцій.
            </div>
        ) : (<></>)}
        <div className="text-center text-danger">Підтвердіть видалення категорії: <i>{category.name}</i> ?</div>
    </>;

    return <ModalDelete
        modalId={modalWindowIds.categoryDelete}
        modalTitle={`Видалити категорію з ID: ${category.id}`}
        modalBody={deleteView}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
    />
}

export default CategoryFormDelete;