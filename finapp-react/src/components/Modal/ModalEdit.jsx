import React from "react";

function ModalEdit({modalId, modalTitle, modalBody, formId, isFormSaving}){
    return(
        <div className="modal modal-sm fade" id={modalId} tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
             aria-labelledby={`${modalId}-label`} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-6" id="{`${modalId}-label`}">{modalTitle}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div className="modal-body">{modalBody}</div>
                    <div className="modal-footer">
                        {isFormSaving ? (
                            <button type="submit" className="btn btn-sm btn-primary" disabled>
                                <span className="spinner-border spinner-border-sm" role="status"
                                      aria-hidden="true"></span>
                                <span>Зберігаю...</span>
                            </button>
                        ) : (
                            <button type="submit" form={formId} className="btn btn-sm btn-primary">Зберегти</button>
                        )}
                        <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">Закрити</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalEdit;