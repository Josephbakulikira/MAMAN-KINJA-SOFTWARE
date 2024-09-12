import React, {useState} from 'react';
import "./style.css"
import StyledButton from '../styledButton';
import { toast } from 'react-toastify';
import { useIdeal } from '../../context';
import { createBill } from '../../api/bill';

const payements = [
    "CASH",
    "CREDIT",
    "CREDIT-HOTEL"
];

function SingleOrder({order, users, closeModal}) {
    const [payementType, setPayement] = useState("CASH");
    const [note, setNote] = useState("");
    const {setPending, fetchBills, fetchAllBills, userInfo, clients} = useIdeal();
    const [clientId, setClientId] = useState("");
    // console.log(clients);
    const GenerateBill = async () => {
        // console.log(clientId);
        if(order.status === "processing"){
            return toast.warn("Erreur ! Avant de generer la facture , soyez sur que votre commande n'est plus en attente");
        }
        if(!payementType){
            return toast.warn("Erreur ! Choisissez votre Methode de payement  ! ");
        }
        if(payementType === "CREDIT-HOTEL" && clientId === ""){
            return toast.warn("Erreur ! Veuillez selectionner un client avant de continuer  ! ");

        }

        try{
            setPending(true);
            const res = await createBill(
                {
                    paid: false,
                    payement: payementType,
                    table: order.table,
                    waiter: order.waiter,
                    total: order.total,
                    items: order.items,
                    orderId: order._id,
                    clientId: clientId
                }
            );
            if(res?.success){
                setPending(false);

                toast.success("Facture vien d'etre Generé");
                fetchBills();
                if(userInfo?.role === "admin" || userInfo?.role === "dev"){
                    fetchAllBills();
                }
                closeModal()
            }else{
                setPending(false);
                toast.error("Erreur! Verifier votre connexion")
            }
        }catch(err){
            setPending(false);
            toast.error(err?.message || "Erreur! Verifier votre connexion")
        }
    }

    return (
        <div className='p-4'>
            <h4>ID : {order?._id}</h4>
            <hr/>
            <h6 className='text-secondary'>Serveur: {users.filter(user => user._id === order.waiter)[0]?.name}</h6>
            <h6 className='text-secondary'>utilisateur: {users.filter(user => user._id === order.updatedBy)[0]?.name}</h6>
            <h6 className='text-primary'>{order.table}</h6>
            <h6>Produits</h6>
            <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Prix Unitaire</th>
                            <th scope="col">Quantité</th>
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.price} $</td>
                                <td>{item.quantity} Pcs</td>
                                <td>{item.total} $</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            <hr/>
            <div className='center-x'>
                <h4>
                    <strong>Total : </strong> <span className='text-danger' style={{fontSize: "40px"}}>{order.total}</span> $
                </h4> 
            </div>
            <hr/>
            <div className='column'>
                <textarea className='form-control m-2' placeholder='Notifié quelque chose !' value={note} onChange={(e) => setNote(e.target.value)}>
                </textarea>
                <select value={payementType} onChange={(e) => setPayement(e.target.value)} className='elegant-select m-1'>
                    <option value={""}>~selectionner~</option>
                    {
                        payements.map(pay => <option key={pay} value={pay}>{pay}</option>)
                    }
                </select>
                {
                    payementType === "CREDIT-HOTEL" && <select value={clientId} onChange={(e) => setClientId(e.target.value)} className='elegant-select m-1'>
                    <option value={""}>~selectionner~</option>
                    {
                        clients.map(clt => <option key={clt?._id} value={clt?._id}>{clt?.fullname}</option>)
                    }
                </select>
                }
            </div>
            <div className='center-x'>
                <StyledButton onClick={GenerateBill} text="Generer Facture"/>
            </div>
        </div>
    )
}

export default SingleOrder
