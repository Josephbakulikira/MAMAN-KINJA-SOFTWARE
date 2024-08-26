import React, { useEffect, useState } from 'react';
import "../../styles/admin.css"
import { Link, useParams } from 'react-router-dom';
import { useIdeal } from '../../context';
import dateFormat from 'dateformat';

function ReportPage() {
    const {bills, date, users} = useIdeal();
    const [invoices, setInvoices] = useState([]);
    const [usersDict, setUsersDict] = useState({});

    function datetostring(new_date){
        return dateFormat(new_date, "dd/mm/yyyy");
    }

    function getDateBills(new_date){
        let offset = datetostring(new_date);
        const new_bills = bills.filter((single_bill) => {
            console.log(datetostring(single_bill.createdAt), offset);
            return datetostring(single_bill.createdAt) === offset;
        });
        // console.log(offset);
        setInvoices(new_bills);
        // console.log(new_bills)
    }

    function generateUsersDict () {
        let users_dict = {}
        for(let i = 0; i < users.length; i++){
            users_dict[users[i]._id] = users[i].name
        }

        setUsersDict(users_dict);
    }

    const getTotal = (mylist) => {
        let mytotal = 0
        invoices.map((inv) => {
            mytotal += Number(inv.total)
        });
        return mytotal;
    }

    useEffect(() => {
        generateUsersDict()
    }, []);


    useEffect(() => {
        getDateBills(date);
    }, [bills, date]);

    return (
        <div>
            <div className='d-flex m-3' style={{justifyContent: "flex-end"}}>
                <Link className='btn btn-danger' to="/admin">{"<"} Retour </Link>
            </div>
            <div className="center-x">
                <h2>Inventaire ~ {datetostring(date)}</h2>
            </div>
            <hr style={{color: "gray"}}/>
            {/* {
                invoices.map(invoice => <span key={invoice._id}>{invoice._id}</span>)
            } */}
            {
                invoices.length > 0 ? <>
                
                <h4 className='text-center m-2'>Rapport Comptoir</h4>
            <div className='container'>
            <div className="admin-table ">
                <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Heure-min</th>
                            <th>table</th>
                            <th>details</th>
                            <th>utilisateur</th>
                            <th>Serveur</th>
                            <th>Paiement</th>
                            <th>Total</th>
                            {/* <th>Stock</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        
                            {
                                invoices.map((invoice) => {
                                    return <tr key={invoice._id}>
                                        <td>{dateFormat(new Date(invoice.updatedAt), "HH'hr':MM")}</td>
                                        <td>{invoice.table}</td>
                                        <td style={{width: "50%"}} className='admin-table'>
                                            <table style={{width: "100%"}}>
                                                <thead>
                                                    <tr>
                                                        <th style={{color: "black", fontWeight: "bold"}}>Commande</th>
                                                        <th style={{color: "black", fontWeight: "bold"}}>PU</th>
                                                        <th style={{color: "black", fontWeight: "bold"}}>Quantité</th>
                                                        <th style={{color: "black", fontWeight: "bold"}}>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        invoice.items.map((item) => {
                                                            return <tr key={item.name}>
                                                                <td>{item.name}</td>
                                                                <td>{item.price} $</td>
                                                                <td>{item.quantity}</td>
                                                                <td>{item.total} $</td>
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </td>
                                        <td>{usersDict[invoice.userId]}</td>
                                        <td>{usersDict[invoice.waiter]}</td>
                                        <td style={{fontWeight: "bold", fontSize: "30px"}}>{invoice.payement}</td>

                                        <td style={{fontWeight: "bold"}}>{invoice.total} $</td>
                                    </tr>
                                })
                            }
                        
                    </tbody>
                </table>
                </div>
                <div className='m-3'>
                    <h1 className='text-success text-center badge' style={{fontSize: "50px", letterSpacing: "4px"}}><span className='text-dark' style={{fontSize: "50px"}}>Total:</span>{getTotal(invoices)} $</h1>
                </div>
            </div>
            </div>
            </> 
            : 
            <div className='container'>
                <h2>Pas disponible</h2>
            </div>
            }
        </div>
    )
}

export default ReportPage
