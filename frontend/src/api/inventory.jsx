import client from "./client";

const api_suffix="/api/inventories/";

export const generateInventory = async (body) => {
    try{
        const {data} = await client.post(`${api_suffix}generate`, body, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const getAllInventories = async () => {
    try{
        const {data} = await client.get(`${api_suffix}all`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}