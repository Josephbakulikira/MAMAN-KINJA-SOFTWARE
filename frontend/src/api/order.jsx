import client from "./client";

const api_suffix="/api/orders/"

export const getOrders = async () => {
    try{
        const {data} = await client.get(`${api_suffix}`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const getOrder = async (id) => {
    try{
        const {data} = await client.get(`${api_suffix}/${id}`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const createOrder = async (body) => {
    try{
        const {data} = await client.post(`${api_suffix}/create`, body, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const updateOrder = async (body) => {
    try{
        const {data} = await client.put(`${api_suffix}/update`, body, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const updateOrderStatus = async (body) => {
    try{
        const {data} = await client.post(`${api_suffix}/update`, body, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const deleteOrder = async (id) => {
    try{
        const {data} = await client.delete(`${api_suffix}/delete/${id}`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}