import React from "react";

function Loading({message}){
    return (
        <div className="d-flex justify-content-center m-4 text-primary">
            <div className="m-1 mt-0">{message || ''}</div>
            <div className="spinner-border spinner-border-sm mt-1" role="status"></div>
        </div>
    );
}

export default Loading;