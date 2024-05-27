import React from "react";

function ToastError(){
    const toastId = 'toastError';
    return (

            <div className="toast" id={toastId} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header text-bg-danger">
                    <strong className="me-auto">Whoops... :(</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body" id={`${toastId}-body`}>
                    ...
                </div>
            </div>
    );
}

export default ToastError;