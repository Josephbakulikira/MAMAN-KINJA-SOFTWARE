import React, { useEffect, useState } from 'react'
import CustomModal from '../customModal';
import { useIdeal } from '../../context';
import dateFormat from 'dateformat';
import { FaEye, FaTrash } from 'react-icons/fa';
import Invoice from '../invoice';

function BillsList() {
    const [isOpen, setIsOpen] = useState(false);
    const {userInfo, bills, allBills, users, items} = useIdeal();
    const [selected, setSelected] = useState({})
    const [filteredBills, setFilteredBills] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);

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



  const formatBillItems = (bill) => {
    const formattedItems = [];
    bill.items.forEach((item) => {
      formattedItems.push({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,       });

      console.log("Testing :", item)

    });
    return formattedItems;
  };

  useEffect(() =>{
    filterBillsByDate(selectedDate)
  }, [ selectedDate, bills ])

  const filterBillsByDate = (date) => {
    const filtered = bills.filter((bill) => {
      const billDate = new Date(bill.updatedAt);
      return billDate.toDateString() === date.toDateString();
    });
    setFilteredBills(filtered);
    calculateTotals(filtered);
  };


  const calculateTotals = (filteredBills) => {
    let totalRevenue = 0;
    let totalQuantity = 0;
    filteredBills.forEach((bill) => {
      totalRevenue += bill.total;
      totalQuantity += bill.items.reduce((acc, item) => acc + item.quantity, 0);
    });
    setTotalRevenue(totalRevenue);
    setTotalQuantity(totalQuantity);
  };

  const handleDateChange = (date) =>{
    setSelectedDate(date)
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
                  <th></th>
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
                      <td>{bill.processed === true ? "✔️" : "✖️"}</td>
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
