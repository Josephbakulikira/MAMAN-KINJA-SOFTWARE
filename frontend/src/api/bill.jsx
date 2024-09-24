import client from "./client";

const api_suffix="/api/bills/";

export const createBill = async (body) => {
    try{
        const {data} = await client.post(`${api_suffix}create`, body, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const updateBill = async (body) => {
    try{
        const {data} = await client.put(`${api_suffix}update`,body, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const removeBill = async (body) => {
    try{
        const {data} = await client.post(`${api_suffix}delete`,body, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const eraseBill = async (id) => {
    try{
        const {data} = await client.delete(`${api_suffix}delete/${id}`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const getAllBills = async () => {
    try{
        const {data} = await client.get(`${api_suffix}all`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const getBills = async () => {
    try{
        const {data} = await client.get(`${api_suffix}`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const getBill = async (id) => {
    try{
        const {data} = await client.get(`${api_suffix}all/${id}`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}
