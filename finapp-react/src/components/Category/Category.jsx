import React from "react";

function Category({category, deleteModalBootstrap, setDeleteModalState, editModalBootstrap, setEditModalState}){
    function handleOpenDeleteModal(){
        setDeleteModalState((prev) => ({...prev, ...category}));
        deleteModalBootstrap.show();
    }

    function handleOpenEditModal(){
        setEditModalState((prev) => ({...prev, ...category}));
        editModalBootstrap.show();
    }

    return (
        <div className="row m-1 mt-0">
            <div className="col">
                <i className="bi bi-folder-fill" title={`ID: ${category.id}`}></i> {category.name}
            </div>
            <div className="col-5 text-end">
                <span className="badge text-bg-secondary opacity-75" title="Загальна кількість транзакцій в цій категорії">
                    {category.transactions_count}
                </span>
                <button className="btn btn-sm" onClick={handleOpenEditModal}>
                    <i className="bi bi-pencil"></i>
                </button>
                <button className="btn btn-sm" onClick={handleOpenDeleteModal}>
                    <i className="bi bi-trash"></i>
                </button>
            </div>
        </div>
    );
}

export default Category;