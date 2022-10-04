import { deleteCookie } from "../utils/utils";
import { ACTION_TYPE } from "./actionTypes";

const reducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPE.LOGIN_START:
            return { loggedUser: [], loading: true, success: false, error: "" };
        case ACTION_TYPE.LOGIN_SUCCESS:
            return { loggedUser: action.payload, loading: false, success: true, error: "" };
        case ACTION_TYPE.LOGIN_ERROR:
            return { loggedUser: [], loading: false, success: false, error: action.payload };
        case ACTION_TYPE.REGISTER_START:
            return { ...state, loading: true, success: false, error: "" };
        case ACTION_TYPE.REGISTER_SUCCESS:
            return { ...state, loading: false, success: true, error: "" };
        case ACTION_TYPE.REGISTER_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        case ACTION_TYPE.LOGOUT:
            deleteCookie('accessToken', '/', 'localhost');
            return { loggedUser: [] };
        case ACTION_TYPE.REQUEST_START:
            return { ...state, loading: true, success: false, error: "" };
        case ACTION_TYPE.REQUEST_SUCCESS:
            return { ...state, loading: false, success: true, error: "" };
        case ACTION_TYPE.REQUEST_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        default:
            return state;
    }
};

export default reducer;