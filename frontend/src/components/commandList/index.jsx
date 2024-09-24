import React, { useState } from 'react';
import "./style.css";
import "../../styles/admin.css";
import { useIdeal } from '../../context';
import dateFormat from 'dateformat';
import { FaEye, FaTrash, FaPen } from 'react-icons/fa';
import SimpleButton from '../simpleButton';
import { toast } from 'react-toastify';
import { deleteOrder, updateOrderStatus } from '../../api/order';
import CustomModal from '../customModal';
import SingleOrder from '../singleOrder';
import { confirmAlert } from 'react-confirm-alert';

function OrdersList() {
    const {orders, users, userInfo, setPending, fetchOrders, setOrders} = useIdeal();
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState({});
    const [tabIndex, setTabIndex] = useState(0);

    const closeModal = () => {
        setIsOpen(false);
    }

    function removeOrderFromContext(id){
        let new_orders = orders.filter(single_order => single_order._id !== id);
        setOrders(new_orders);
    }

    const openModal = (order, index) => {
        setIsOpen(true);
        setSelected(order);
        setTabIndex(index);
    }

    
    function findUser (id) {
        return users.filter(user => user._id === id)[0]
    }
    //processing, confirmed, ready, deleted
    const order_status = {
        "processing": {text: "En Attente", color: "secondary"},
        "confirmer": {text: "Confirmé", color: "primary"},
        "ready": {text: "Prêt", color: "success"},
        "deleted": {text: "Supprimé", color: "danger"}
    }

    const HandleChangeStatus = async (id, new_status) => {
        try{
            setPending(true);
            const res = await updateOrderStatus({id, new_status});
            if(res.success){
                setPending(false);
                fetchOrders();
                toast(`le status de Commande a été modifié  -> ${new_status}`);
            }else{
                setPending(false);
            }
        }catch(error){
            toast.error(error.message || "Erreur! Verifier votre connexion");
            setPending(false);
        }
    }

    const HandleDeleteOrder = async (id) => {
        confirmAlert({
            title: `Confirmation de supprimé`,
            message: `Etes vous sur de vouloir supprimé la commande avec comme ID ${id} ?`,
            buttons: [
                {
                    label: "Oui",
                    onClick: async() => {
                        try{
                            setPending(true);
                            const res = await deleteOrder(id);
                            if(res.success){
                                setPending(false);
                                removeOrderFromContext(id);
                                toast.success("Commande suppriméé")
                            }else{
                                // console.log(res)
                                toast.error(
                                    res.message || "Erreur! Verifier votre connexion, Serveur Indisponible"
                                );
                                setPending(false);
                            }
                        }catch(err){
                            toast.error(
                                err.message || "Erreur! Verifier votre connexion, Serveur Indisponible"
                              );
                            setPending(false);
                        }
                    }
                },
                {
                    label: "Non",
                    onClick: () => toast("ouff 😮‍💨")
    
                }
            ]
        })
    }

    return (
        <>
        <div>
            <div className="admin-table">
          <div className="table-container">
            <div className="caption">Liste des commandes</div>
            <table>
              <thead>
                <tr>
                  <th>N° </th>
                  <th>Date - Heure</th>
                  <th>Utilisateur</th>
                  <th>Serveur</th>
                  <th>table</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Voir</th>
                  <th className='th-white'> </th>
                    {(userInfo?.role === "admin" || userInfo?.role === "dev") && <th className='th-white'> </th>}
                  </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  return (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{dateFormat(new Date(order.updatedAt), "hh: MM ~ dd/mm/yyyy")}</td>
                      <td>{findUser(order.updatedBy)?.name}</td>
                      <td>{findUser(order.waiter)?.name}</td>
                      <td>{order.table}</td>
                      <td>{order.total}</td>
                      <td className=''>
                        <select className='elegant-select' onChange={(e) => HandleChangeStatus(order._id, e.target.value)}>
                            <option value={order.status}>
                                {order_status[order.status].text}
                            </option>
                            {
                                Object.keys(order_status).map(item => {
                                    return <option onClick={()=>openModal(order)} className={`text-${order_status[item].color}`} key={item} value={item}>
                                        {order_status[item].text}
                                    </option>
                                })
                            }
                        </select>
                      </td>
                      <td><FaEye style={{cursor: "pointer"}} onClick={()=>openModal(order, 0)}/></td>
                      {/* <td>
                        <button className='btn btn-secondary' onClick={()=>openModal(order, 1)}><FaPen/></button>
                      </td> */}
                      {
                        (userInfo?.role === "admin" || userInfo?.role === "dev") && <td>
                            <button onClick={() => HandleDeleteOrder(order._id)} className="btn btn-danger"><FaTrash /></button>
                        </td>
                        }
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        </div>
        
        <CustomModal isOpen={isOpen} closeModal={closeModal}>
            {tabIndex === 0 && <SingleOrder closeModal={closeModal} order={selected} users={users}/>}
            {tabIndex === 1 && <>
                <h3>Modifier la commande</h3>
                <hr/>
            </>}
        </CustomModal>
        </>
    )
}

export default OrdersList
