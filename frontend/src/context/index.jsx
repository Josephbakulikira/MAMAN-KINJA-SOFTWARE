import React, {createContext, useContext, useEffect, useState} from 'react'
import { toast } from 'react-toastify';
import { getUser, getUsers } from '../api/user';
import { getItems } from '../api/item';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../api/order';
import { getAllBills, getBills } from '../api/bill';
import { getClients } from '../api/clientuser';
import { getRooms } from '../api/room';

const IdealContext = createContext();

function IdealProvider({children}){
    const [loggedIn, setLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [pending, setPending] = useState(false);
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [bills, setBills] = useState([]);
    const [date, setDate] = useState(null);
    const [clients, setClients] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [allBills, setAllBills] = useState([]);
    const [cart, setCart] = useState({
        items: [],
        total: 0,
        payementType: "",
        waiter: "",
        table: "",
        clientName: "",
        clientNumber: "",
    });

    const fetchUsers = async () => {
        setPending(true);
        try{
            const res = await getUsers();
            if(res?.success){
                setUsers(res.users);
                setPending(false);
            }else{
                toast.error(res.message || "Erreur, Verifier votre connexion! serveur indisponible")
                setPending(false);
            }
        }catch(err){
            toast.error(err.message || "Erreur, Verifier votre connexion! serveur indisponible")
            setPending(false);
        }
    }

    const fetchItems = async () => {
        setPending(true);
        try{
            const res = await getItems();
            if(res?.success){
                setItems(res.items);
                setPending(false);
            }else{
                toast.error(res.message || "Erreur, Verifier votre connexion! serveur indisponible")
                setPending(false);
            }
        }catch(err){
            toast.error(err.message || "Erreur, Verifier votre connexion! serveur indisponible")
            setPending(false);
        }
    }

    const fetchClients = async () => {
        setPending(true);
        try{
            const res = await getClients();
            if(res?.success){
                setClients(res.clients);
                setPending(false);
            }else{
                toast.error(res.message || "Erreur, Verifier votre connexion! serveur indisponible")
                setPending(false);
            }
        }catch(err){
            toast.error(err.message || "Erreur, Verifier votre connexion! serveur indisponible")
            setPending(false);
        }
    }

    const fetchRooms = async () => {
        setPending(true);
        try{
            const res = await getRooms();
            if(res?.success){
                setRooms(res.rooms);
                setPending(false);
            }else{
                toast.error(res.message || "Erreur, Verifier votre connexion! serveur indisponible")
                setPending(false);
            }
        }catch(err){
            toast.error(err.message || "Erreur, Verifier votre connexion! serveur indisponible")
            setPending(false);
        }
    }

    const fetchOrders = async () => {
        setPending(true);
        try{
            const res = await getOrders();
            if(res?.success){
                setOrders(res.orders);
                setPending(false);
            }else{
                toast.error(res.message || "Erreur, Verifier votre connexion! serveur indisponible")
                setPending(false);
            }
        }catch(err){
            toast.error(err.message || "Erreur, Verifier votre connexion! serveur indisponible")
            setPending(false);
        }
    }

    const fetchBills = async () => {
        setPending(true);
        try{
            const res = await getBills();
            if(res?.success){
                setBills(res.bills);
                setPending(false);
            }else{
                toast.error(res.message || "Erreur, Verifier votre connexion! serveur indisponible")
                setPending(false);
            }
        }catch(err){
            toast.error(err.message || "Erreur, Verifier votre connexion! serveur indisponible")
            setPending(false);
        }
    }

    const fetchAllBills = async () => {
        setPending(true);
        try{
            const res = await getAllBills();
            if(res?.success){
                setAllBills(res.bills);
                setPending(false);
            }else{
                toast.error(res.message || "Erreur, Verifier votre connexion! serveur indisponible")
                setPending(false);
            }
        }catch(err){
            toast.error(err.message || "Erreur, Verifier votre connexion! serveur indisponible")
            setPending(false);
        }
    }

    const fetchUser = async () => {
        // console.log(localStorage.getItem("userInfo"));
        if(localStorage.getItem("userInfo")){
            const user = await getUser(JSON.parse(localStorage.getItem("userInfo"))?._id);
            if(user?.success){
                setUserInfo(user.user);
                // console.log(user);
                localStorage.setItem("userInfo", JSON.stringify(user.user));
            }else{
                toast.error("Erreur d'authentication ! Veuillez vous reconnectez !")
                localStorage.removeItem("userInfo")
                // window.location.reload();
                window.location.replace("/")
            }
        }
    }

    useEffect(() => {
        fetchUser();
        fetchUsers();
        fetchItems();
        fetchOrders();
        fetchBills();
        fetchAllBills();
        fetchClients();
        fetchRooms();
    }, []);

    return (
        <IdealContext.Provider value={{loggedIn, setLoggedIn, userInfo, 
            setUserInfo, pending, setPending, 
            items, setItems, users, setUsers, 
            orders, setOrders, bills, setBills,
            fetchOrders, fetchUsers, fetchItems,fetchBills, fetchAllBills, fetchClients, fetchRooms,
            allBills, setAllBills, date, setDate, rooms, setRooms, clients, setClients,
            cart, setCart}}>
                {children}
        </IdealContext.Provider>
    )
}

export const useIdeal = () => useContext(IdealContext);

export default IdealProvider;