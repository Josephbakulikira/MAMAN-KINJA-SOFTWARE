import React, { useRef } from 'react';
import "./style.css";
import { useIdeal } from '../../context';
import dateFormat from 'dateformat';
import QRCode from "react-qr-code";
import SimpleButton from '../simpleButton';
import { useReactToPrint } from 'react-to-print';

function Invoice({bill }) {
    const billRef = useRef()
    // console.log(bill);
    const {allBills, users} = useIdeal();

    const HandlePrint = useReactToPrint({
        content: () => billRef.current,
    });
    return (
        <>
        <div className='center-x'>
                <SimpleButton onClick={HandlePrint} text="Imprimer"/>
            </div>
            
        <section className="wrapper-invoice" ref={billRef} style={{overflow: "hidden"}}>
            
      <div  id="invoice_id" className="invoice">
      <div className="invoice-logo-brand">
          <h3 style={{fontSize: "40px", whiteSpace: 'nowrap', textAlign: 'center'}}>MAMAN KINJA</h3>
        </div>
        <div className="invoice-information">
          <p><b>Facture #</b> : {allBills.length}</p>
          <p><b>Date </b>: {dateFormat(new Date(bill.updatedAt), "dd/mm/yyyy")}</p>
          <p><b>Heure</b> : {dateFormat(new Date(bill.updatedAt), "HH : MM")}</p>
        </div>
        
        
        <div className="invoice-head">
          <div className="head client-info">
            <p>114 Av. Hippodrome, Nyalukemba, Bukavu</p>
            <p>+243(0)973 952 327</p> 
            <p>Bukavu / Sud-Kivu / RDC</p>
          </div>
          <div className="head client-data">
          </div>
        </div>
        <div className="invoice-body">
          <table className="table">
            <thead>
              <tr>
                <th>produit</th>
                <th>PU</th>
                <th>Quantité</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {
                bill.items.map((itm, index) => {
                    return <tr key={itm.name}>
                    <td>{itm.name}</td>
                    <td>{itm.price} $</td>
                    <td>{itm.quantity}</td>
                    <td>{itm.total} $</td>

                  </tr>
                })
              }
            </tbody>
          </table>
          <div className="flex-table">
            <div className="flex-column"></div>
            <div className="flex-column">
              <table className="table-subtotal">
                <tbody>
                  <tr>
                    <td>total</td>
                    <td>{bill.total} $</td>
                  </tr>
                  <tr>
                    <td>Methode de payement</td>
                    <td style={{fontWeight: "bold"}}>{bill.payement}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* <div className="invoice-total-amount">
            <p>{bill.total}</p>
          </div> */}
        </div>
        <div className="invoice-footer text-center">
          <p>Merci de nous avoir choisi</p>
        </div>
        {/* <div className="center-x">
            <QRCode value={`${bill._id} - maman kinja`} size={100}/>
        </div> */}
        <div className='center-x'>
            <p>Serveur: {users.filter(sgl => sgl._id === bill?.waiter)[0]?.name}</p>
        </div>
      </div>
    </section>
    </>
    )
}

export default Invoice
