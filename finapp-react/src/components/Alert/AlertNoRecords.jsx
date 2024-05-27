function AlertNoRecords({message}){
    return (
        <div className="alert alert-secondary opacity-75 m-1 text-center" role="alert">
            {(message ? message : 'Тут ще немає записів.')}
        </div>
    );
}

export default AlertNoRecords;