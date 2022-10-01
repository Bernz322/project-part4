import axios from 'axios';
import { accessTokenChecker } from "./utils";

const apiRequest = async (path, config = {}) => {
    const token = accessTokenChecker("accessToken");
    const request = {
        url: `http://localhost:5000${path}`,
        ...config,
    };

    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await axios(request);
    let data = null;
    try {
        data = res.data;
    } catch (error) { }
    return data;
};

export const login = async ({ email, password }) => {
    const res = await apiRequest(`/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: { email, password }
    });

    return res;
};

export const register = async ({ name, email, password }) => {
    const res = await apiRequest(`/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: { name, email, password }
    });

    return res;
};

export const fetchLoggedInUser = async () => {
    const { id } = JSON.parse(localStorage.getItem("loggedUser"));
    const res = await apiRequest(`/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return res;
};

export const fetchMessages = async () => {
    const res = await apiRequest(`/chats`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return res;
};

export const sendMessage = async ({ user_id, message, time }) => {
    const res = await apiRequest(`/chats`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: { user_id, message, time }
    });
    return res;
};

export const fetchUsers = async () => {
    const res = await apiRequest(`/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return res;
};

export const fetchUserById = async (id) => {
    const res = await apiRequest(`/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return res;
};

export const editUserById = async ({ id, name, email }) => {
    const res = await apiRequest(`/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: { name, email }
    });
    return res;
};

export const deleteUserById = async (id) => {
    const res = await apiRequest(`/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return res;
};

export const fetchUserUploads = async () => {
    const { id } = JSON.parse(localStorage.getItem("loggedUser"));
    const res = await apiRequest(`/uploads/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return res;
};

export const fetchUploads = async () => {
    const res = await apiRequest(`/uploads/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return res;
};

export const fetchUploadById = async (id) => {
    const res = await apiRequest(`/uploads/single/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return res;
};

// Get upload by id
// Edit uploads
// Delete uploads
// Add uploads
// Add share
// Remove share
// Socket io

