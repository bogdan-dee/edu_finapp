
export const toastIds = {
    success: 'toastSuccess',
    error: 'toastError'
}

export function createToastSuccess(){
    return new bootstrap.Toast(document.getElementById(toastIds.success));
}
export function createToastError(){
    return new bootstrap.Toast(document.getElementById(toastIds.success));
}

export function showToastSuccess(message){
    let elem = document.getElementById(toastIds.success);
    let toast = bootstrap.Toast.getOrCreateInstance(elem);
    document.getElementById(`${toastIds.success}-body`).innerHTML = message || '';
    toast.show();
}

export function showToastError(message){
    let elem = document.getElementById(toastIds.error);
    let toast = bootstrap.Toast.getOrCreateInstance(elem);
    document.getElementById(`${toastIds.error}-body`).innerHTML = message || '';
    toast.show();
}