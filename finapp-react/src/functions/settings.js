export const modalWindowIds = {
    categoryEdit: 'categoryEditModal',
    categoryDelete: 'categoryDeleteModal',
    transactionEdit: 'transactionEditModal',
    transactionDelete: 'transactionDeleteModal'
};

export const defaultSWROptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: true,
    errorRetryCount: 1
};

export const APIEndpoint = 'http://finapp.local';
export const APIMethods = {
    users: '/users/',
    user: '/users/:id/',
    categories: '/categories/',
    category: '/categories/:id/',
    transactions: '/transactions/',
    transaction: '/transactions/:id/',
}

export function buildAPIUrl(method, args = {}, auth = {}) {
    // provide entity ID
    let methodStr = APIMethods[method];
    if (Object.keys(args).length > 0) {
        methodStr = methodStr.replace(':id', args['id']);
    }

    // build string for user auth simulation
    let authStr = '';
    if (Object.keys(auth).length > 0) {
        authStr = '?user_id=' + auth['user_id'];
    }

    // build date filter for transactions list API
    let filter = '';
    if (method === 'transactions') {
        const checkedDateFilterRadio = document.querySelector('#dateFilter input[name="dateFilter"]:checked');
        if (checkedDateFilterRadio !== undefined && checkedDateFilterRadio !== null) {
            filter = '&date_filter=' + checkedDateFilterRadio.id.replace('date-filter-', '');
            filter = filter + '&timezone=' + Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
    }

    return APIEndpoint + methodStr + authStr + filter;
}