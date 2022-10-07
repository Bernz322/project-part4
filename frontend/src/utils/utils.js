export const tablePopulate = (data) => {
    let len = data?.length;
    let size;
    size = len === 0 ? size = 5
        : len === 1 ? size = 4
            : len === 2 ? size = 3
                : len === 3 ? size = 2
                    : len === 4 ? size = 1
                        : size = 1;

    let filteredData = [];

    for (let i = 0; i < len + size; i++) {
        filteredData.push(data[i]);
    }

    return filteredData;
};

export const validateEmail = (email) => {
    let atPosition = email.indexOf("@");
    let dotPosition = email.lastIndexOf(".");

    if (atPosition < 1 || dotPosition - atPosition < 2) {
        return true;
    };
};

export const accessTokenChecker = (name) => {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    } else {
        return false;
    }
};

export const setCookie = (cookieName, value, daysToExpire) => {
    const toStore = value;
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + daysToExpire);
    document.cookie = cookieName + "=" + (toStore) + ((daysToExpire == null) ? "" : ";expires = " + currentDate.toGMTString()) + '; path=/';
    window.location.href = '/login-success';
};

export const deleteCookie = (cookieName, path, domain) => {
    if (accessTokenChecker(cookieName)) {
        document.cookie = cookieName + "=" +
            ((path) ? ";path=" + path : "") +
            ((domain) ? ";domain=" + domain : "") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
};

export const getCurrentLoggedUser = () => {
    const { id, name, email } = JSON.parse(localStorage.getItem("loggedUser")) || [];
    const user = {
        id,
        name,
        email
    };
    return user;
};

export const getMessageDate = () => {
    let date, time, year;
    date = new Date();  // Get current date
    date = (date.toLocaleString()).split(' ');  // Split it and turn it to array; ['9/9/2022,', '8:02:37', 'PM']
    time = date[1];
    date = date[0].split('/');  // To turn "/" to "-", we have to split them again; ['9', '9', '2022,']
    year = date[2].split(',');
    return date = year[0] + '-' + date[1] + '-' + date[0] + ' ' + time; // 2022-9-9 9:49:25
};