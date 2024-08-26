import client from "./client";

const api_suffix="/api/rooms"

export const getRooms = async () => {
    try{
        const {data} = await client.get(`${api_suffix}/all`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const getRoom = async (id) => {
    try{
        const {data} = await client.get(`${api_suffix}/${id}`, {withCredentials: true});
        // console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error
    }
}

export const createRoom = async (body) => {
    try{
        const {data} = await client.post(`${api_suffix}/create`, body, {withCredentials: true});
        console.log(data);
        return data;
    }catch(error) {
        // console.log(error);
        return error;
    }
}

export const deleteRoom = async (body) => {
    try{
        const {data} = await client.post(`${api_suffix}/delete`, body, {withCredentials: true});
        return data;
    }catch(error) {
        return error;
    }
}

export const updateRoomAvailability = async (body) => {
    try{
        const {data} = await client.put(`${api_suffix}/update-availability`, body, {withCredentials: true});
        return data;
    }catch(error) {
        return error;
    }
}