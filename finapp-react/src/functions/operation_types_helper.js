// TOGO: get operation types from the server

export const OPERATION_TYPE_INCOME = 1;
export const OPERATION_TYPE_INCOME_STRING = 'income';
export const OPERATION_TYPE_EXPENSE = 2;
export const OPERATION_TYPE_EXPENSE_STRING = 'expense';
export const OPERATION_TYPE_EXCHANGE = 3; // it's for future, TODO: implement exchange tracking operations
export const OPERATION_TYPE_EXCHANGE_STRING = 'exchange';

export function getOperationTypes(){
    return [OPERATION_TYPE_INCOME, OPERATION_TYPE_EXPENSE];
}

export function getOperationTypesNames(){
    return [OPERATION_TYPE_INCOME_STRING, OPERATION_TYPE_EXPENSE_STRING]
}

export function getOperationTypesMapped(){
    return {
        [OPERATION_TYPE_INCOME]: OPERATION_TYPE_INCOME_STRING,
        [OPERATION_TYPE_EXPENSE]: OPERATION_TYPE_EXPENSE_STRING
    }
}
export function getOperationTypesMappedReverse(){
    let obj = getOperationTypesMapped();

    return Object.keys(obj).reduce((r, key) => (Object.assign(r, {
        [obj[key]]: key,
    })), {});
}