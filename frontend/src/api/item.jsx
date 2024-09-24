import client from "./client";

const api_suffix="/api/items/"

export const getItems = async () => {
    try{
        const {data} = await client.get(`${api_suffix}`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const createItem = async (new_item) => {
    try{
        const {data} = await client.post(`${api_suffix}create`, new_item, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const UpdateStockItems = async (items) => {
    try{
        const {data} = await client.post(`${api_suffix}buy`, items, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const updateItem = async (updated_item) => {
    try{
        const {data} = await client.put(`${api_suffix}update`, updated_item, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const deleteItem = async (id) => {
    try{
        const {data} = await client.delete(`${api_suffix}delete/${id}`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const getItem = async (id) => {
    try{
        const {data} = await client.get(`${api_suffix}${id}`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}