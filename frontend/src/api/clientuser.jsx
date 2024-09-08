import client from "./client";

const api_suffix="/api/clients"

export const getClients = async () => {
    try{
        const {data} = await client.get(`${api_suffix}/all`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        return error
    }
}

export const getClient = async (id) => {
    try{
        const {data} = await client.get(`${api_suffix}/${id}`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const createClient = async (body) => {
    try{
        const {data} = await client.post(`${api_suffix}/create`, body, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error;
    }
}

export const deleteClient = async (body) => {
    try{
        const {data} = await client.post(`${api_suffix}/delete`, body, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error;
    }
}

export const updateClientHistory = async (body) => {
    try{
        const {data} = await client.put(`${api_suffix}/update-history`, body, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error;
    }
}

export const updateClient = async (body) => {
    try{
        const {data} = await client.put(`${api_suffix}/update`, body, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error;
    }
}