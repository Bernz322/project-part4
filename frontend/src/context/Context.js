import React, { createContext, useReducer, useEffect, useState } from 'react';
import reducer from "../reducer/reducer";

const INITIAL_STATE = {
    loggedUser: JSON.parse(localStorage.getItem("loggedUser")) || {},
    loading: false,
    success: false,
    error: "",
};

export const DataContext = createContext(INITIAL_STATE);

export default function Context({ children }) {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const [fetchAgain, setFetchAgain] = useState(false);

    useEffect(() => {
        localStorage.setItem("loggedUser", JSON.stringify(state.loggedUser) || {});
    }, [state.loggedUser]);

    const contextValues = {
        loggedUser: state.loggedUser,
        loading: state.loading,
        success: state.success,
        error: state.error,
        dispatch,
        fetchAgain,
        setFetchAgain
    };

    return (
        <DataContext.Provider value={contextValues}>
            {children}
        </DataContext.Provider>
    );
}
