import React, {useState} from 'react';
import "./style.css"
import StyledButton from '../styledButton';
import { toast } from 'react-toastify';
import { useIdeal } from '../../context';
import { createBill } from '../../api/bill';

const payements = [
    "CASH",
    "CARTE VISA",
    "CREDIT",
    "AIRTEL MONEY",
    "ORANGE MONEY",
    "MPESA"
];

function SingleOrder({order, users}) {
    const [payementType, setPayement] = useState("CASH");
    const [note, setNote] = useState("");
    const {setPending, fetchBills, fetchAllBills, userInfo} = useIdeal();

    const GenerateBill = async () => {
        if(order.status === "processing"){
            return toast.warn("Erreur ! Avant de generer la facture , soyez sur que votre commande n'est plus en attente");
        }
        if(!payementType){
            return toast.warn("Erreur ! Choisissez votre Methode de payement  ! ");
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
                }
            );
            if(res?.success){
                setPending(false);

                toast.success("Facture vien d'etre Generé");
                fetchBills();
                if(userInfo?.role === "admin" || userInfo?.role === "dev"){
                    fetchAllBills();
                }
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
            <ol style={{overflowY: "scroll"}}>
                {
                    order.items?.map((item) => {
                        return <li key={item.id}>
                            <ul>
                                <li className='m-0 p-0'><b>Nom:</b> <span style={{fontSize: "16px", marginInline: "5px", fontWeight: "bold", color: "cornflowerblue"}}>{item.name}</span></li>
                                <li className='m-0 p-0'><b>Prix Unitaire:</b> <span style={{fontSize: "16px", marginInline: "5px", fontWeight: "bold", color: "cornflowerblue"}}>{item.price}</span> $</li>
                                <li className='m-0 p-0'><b>Quantité:</b> <span style={{fontSize: "16px", marginInline: "5px", fontWeight: "bold", color: "cornflowerblue"}}>{item.quantity}</span> Pcs</li>
                                <li className='m-0 p-0'><b>sub-total:</b><span style={{fontSize: "16px", marginInline: "5px", fontWeight: "bold", color: "cornflowerblue"}}>{item.total}</span> $</li>
                            </ul>
                        </li>
                    })
                }
            </ol>
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
            </div>
            <div className='center-x'>
                <StyledButton onClick={GenerateBill} text="Generer Facture"/>
            </div>
        </div>
    )
}

export default SingleOrder
