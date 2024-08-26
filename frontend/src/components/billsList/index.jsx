import React, { useState } from 'react'
import CustomModal from '../customModal';
import { useIdeal } from '../../context';
import dateFormat from 'dateformat';
import { FaEye, FaTrash } from 'react-icons/fa';
import Invoice from '../invoice';

function BillsList() {
    const [isOpen, setIsOpen] = useState(false);
    const {userInfo, bills, allBills, users} = useIdeal();
    const [selected, setSelected] = useState({})

    function closeModal(){
        setIsOpen(false);
    }

    function findUser (id) {
        return users.filter(user => user._id === id)[0]
    }

    function openModal(bill){
        setIsOpen(true);
        setSelected(bill?.bill || bill);
    }
    return (
        <>
        <div>
            <div className="admin-table">
          <div className="table-container">
            <div className="caption">Liste des factures</div>
            <table>
              <thead>
                <tr>
                  <th>N° </th>
                  <th>Date - Heure</th>
                  <th>Utilisateur</th>
                  <th>Serveur</th>
                  <th>table</th>
                  <th>Total</th>
                  <th>payement</th>
                  <th>Voir</th>
                    {(userInfo?.role === "admin" || userInfo?.role === "dev") && <th className='th-white'> </th>}
                  </tr>
              </thead>
              <tbody>
                {bills.map((bill, index) => {
                  return (
                    <tr key={bill._id}>
                      <td>{index + 1}</td>
                      <td>{dateFormat(new Date(bill.updatedAt), "hh: MM ~ dd/mm/yyyy")}</td>
                      <td>{findUser(bill.updatedBy)?.name}</td>
                      <td>{findUser(bill.waiter)?.name}</td>
                      <td>{bill.table}</td>
                      <td>{bill.total}</td>
                      <td>{bill.payement}</td>
                      <td><FaEye style={{cursor: "pointer"}} onClick={()=>openModal(bill)}/></td>
                      {
                        (userInfo?.role === "admin" || userInfo?.role === "dev") && <td>
                            <button onClick={() => {}} className="btn btn-danger"><FaTrash /></button>
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
            <Invoice bill={selected}/>
        </CustomModal>
        </>
    )
}

export default BillsList
