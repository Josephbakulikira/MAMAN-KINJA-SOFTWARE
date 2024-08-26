import client from "./client";

const api_suffix="/api/users/"

export const loginUser = async (credentials) => {
    try{
        const {data} = await client.post(`${api_suffix}auth`, credentials, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        console.log(error);
        return error
    }
}

export const registerUser = async (new_user) => {
    try{
        const {data} = await client.post(`${api_suffix}register`, new_user, {withCredentials: true});
        return data;
    }catch(error) {
        return error;
    }
}

export const logoutUser = async () => {
    try{
        const {data} = await client.post(`${api_suffix}logout`, {withCredentials: true});
        return data;
    }catch(error) {
        return error;
    }
}

export const getUsers = async () => {
    try{
        const {data} = await client.get(`${api_suffix}all`, {withCredentials: true});
        return data;
    }catch(error) {
        return error;
    }
}

export const updateUserRole = async (body) => {
    try{
        const {data} = await client.put(`${api_suffix}role`, body, {withCredentials: true});
        return data;
    }catch(error) {
        return error;
    }
}

export const getUser = async (id) => {
    try{
        const {data} = await client.get(`${api_suffix}all/${id}`, {withCredentials: true});
        return data;
    }catch(error) {
        return error;
    }
}


