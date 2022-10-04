import { ACTION_TYPE } from "./actionTypes";

export const LoginStart = () => {
    return {
        type: ACTION_TYPE.LOGIN_START
    };
};

export const LoginSuccess = (loggedUserID) => {
    return {
        type: ACTION_TYPE.LOGIN_SUCCESS,
        payload: loggedUserID
    };
};

export const LoginError = () => {
    return {
        type: ACTION_TYPE.LOGIN_ERROR,
    };
};

export const RegisterStart = () => {
    return {
        type: ACTION_TYPE.REGISTER_START
    };
};

export const RegisterSuccess = () => {
    return {
        type: ACTION_TYPE.REGISTER_SUCCESS,
    };
};

export const RegisterError = () => {
    return {
        type: ACTION_TYPE.REGISTER_ERROR,
    };
};

export const RequestStart = () => {
    return {
        type: ACTION_TYPE.REQUEST_START
    };
};

export const RequestSuccess = () => {
    return {
        type: ACTION_TYPE.REQUEST_SUCCESS,
    };
};

export const RequestError = () => {
    return {
        type: ACTION_TYPE.REQUEST_ERROR,
    };
};

export const Logout = () => {
    return {
        type: ACTION_TYPE.LOGOUT,
    };
};