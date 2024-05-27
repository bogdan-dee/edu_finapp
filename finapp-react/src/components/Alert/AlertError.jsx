function AlertError({message}){
    return (
        <div className="alert alert-danger m-1 text-center" role="alert">
            {(message ? message : 'whoops :( something failed')}
        </div>
    );
}

export default AlertError;