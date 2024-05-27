function AlertError({message}){
    return (
        <div className="alert alert-danger m-1 text-center" role="alert">
            {(message ? message : 'Упс :( Щось зломилося...')}
        </div>
    );
}

export default AlertError;