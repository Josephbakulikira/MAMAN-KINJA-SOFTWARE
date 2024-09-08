import React from 'react';
import "../styles/hotelInvoice.css";
import dateFormat from 'dateformat';
import { useIdeal } from '../context';

function HotelInvoice({client}) {
    const {bills} = useIdeal();
    const restaurant_total = getTotalOfClientBills();
    
    function getTotalOfClientBills(){
        let vl = 0
        bills.filter(b => b.clientId === client._id).map(b => {
            vl +=  Number(b.total)
        })
        return vl
    }
    return (
        <div className="invoice-hotel" style={{overflow: "auto", maxHeight: "90vh"}}>
            <div className="page-content container">
    <div className="page-header text-blue-d2">
        <h1 className="page-title text-secondary-d1">
            Facture
            <small className="page-info">
                <i className="fa fa-angle-double-right text-80"></i>
                ID: {client?._id}
            </small>
        </h1>

        <div className="page-tools">
            <div className="action-buttons">
                <a className="btn bg-white btn-light mx-1px text-95" href="#" data-title="Print">
                    <i className="mr-1 fa fa-print text-primary-m1 text-120 w-2"></i>
                    Imprimer
                </a>
                <a className="btn bg-white btn-light mx-1px text-95" href="#" data-title="PDF">
                    <i className="mr-1 fa fa-file-pdf-o text-danger-m1 text-120 w-2"></i>
                    Telecharger
                </a>
            </div>
        </div>
    </div>

    <div className="container px-0">
        <div className="row mt-4">
            <div className="col-12 col-lg-12">
                <div className="row">
                    <div className="col-12">
                        <div className="text-center text-150">
                            <i className="fa fa-book fa-2x text-success-m2 mr-1"></i>
                            <span className="text-default-d3" style={{fontWeight: "bold", fontFamily: "Poppins", fontSize: "23px", textTransform: "uppercase"}}>www.mamankinja.com</span>
                        </div>
                    </div>
                </div>
                <hr className="row brc-default-l1 mx-n1 mb-4" />

                <div className="row">
                    <div className="col-sm-6">
                        <div>
                            <span className="text-sm text-grey-m2 align-middle">A:</span>
                            <span className="text-600 text-110 text-blue align-middle">{client?.fullname}</span>
                        </div>
                        <div className="text-grey-m2">
                            <div className="my-1">
                                {client?.address}
                            </div>
                            <div className="my-1">
                                {client?.email}
                            </div>
                            <div className="my-1"><i className="fa fa-phone fa-flip-horizontal text-secondary"></i> <b className="text-600">{client?.phoneNumber}</b></div>
                        </div>
                    </div>

                    <div className="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                        <hr className="d-sm-none" />
                        <div className="text-grey-m2">
                            <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">
                                Facture
                            </div>

                            <div className="my-2"><i className="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span className="text-600 text-90">ID:</span> {client?._id}</div>

                            <div className="my-2"><i className="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span className="text-600 text-90">Date:</span>{dateFormat(new Date(), "dd/mm/yyyy")}</div>

                            <div className="my-2"><i className="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span className="text-600 text-90">Status:</span> <span className="badge badge-warning badge-pill px-25">........</span></div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="row text-600 text-white bgc-default-tp1 py-25">
                        <div className="d-none d-sm-block col-1">#</div>
                        <div className="col-9 col-sm-5">Description</div>
                        <div className="d-none d-sm-block col-4 col-sm-2">Jours</div>
                        <div className="d-none d-sm-block col-sm-2">P.U</div>
                        <div className="col-2">Amount</div>
                    </div>

                    <div className="text-95 text-secondary-d3">
                        <div className="row mb-2 mb-sm-0 py-25">
                            <div className="d-none d-sm-block col-1">1</div>
                            <div className="col-9 col-sm-5">Sejour dans la chambre numero <b style={{whiteSpace: "nowrap"}}>{client?.roomNumber}</b></div>
                            <div className="d-none d-sm-block col-2">{client?.days} jr(s)</div>
                            <div className="d-none d-sm-block col-2 text-95">{Number(client?.total)/Number(client?.days)}$</div>
                            <div className="col-2 text-secondary-d2">{client?.total}$</div>
                        </div>
                    </div>

                    <div className="row border-b-2 brc-default-l2"></div>

            <div className="table-responsive">
                <h4>Restaurant</h4>
                <table className="table table-striped table-borderless border-0 border-b-2 brc-default-l1">
                    <thead className="bg-none bgc-default-tp1">
                        <tr className="text-white">
                            <th className="opacity-2">#</th>
                            <th>Date</th>
                            <th>ID facture</th>
                            <th width="140">total</th>
                        </tr>
                    </thead>

                    <tbody className="text-95 text-secondary-d3">
                        <tr></tr>
                        {
                            bills.filter(single_bill => single_bill.clientId === client._id).map((single_bill, index) => {
                                return <tr key={single_bill?._id}>
                                <td>{index+1}</td>
                                <td>{dateFormat(new Date(single_bill?.createdAt), "dd/mm/yyy")}</td>
                                <td>{single_bill?._id}</td>
                                <td className="text-95">{single_bill?.total} $</td>
                            </tr> 
                            })
                        }
                    </tbody>
                </table>
            </div>
                    <div className="row mt-3">
                        <div className="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0">
                            
                        </div>

                        <div className="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
                            <div className="row my-2">
                                <div className="col-7 text-right">
                                    Sous-total (resto)
                                </div>
                                <div className="col-5">
                                    <span className="text-120 text-secondary-d1">{restaurant_total} $</span>
                                </div>
                            </div>

                            <div className="row my-2">
                                <div className="col-7 text-right">
                                    Sous-total (hotel)
                                </div>
                                <div className="col-5">
                                    <span className="text-110 text-secondary-d1">{client.total} $</span>
                                </div>
                            </div>

                            <div className="row my-2 align-items-center bgc-primary-l3 p-2">
                                <div className="col-7 text-right">
                                    Total Amount
                                </div>
                                <div className="col-5">
                                    <span className="text-150 text-success-d3 opacity-2">{Number(restaurant_total) + Number(client.total)} $</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div>
                        <span className="text-secondary-d1 text-105">Merci d'avoir choisi l'hotel Maman Kinja</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        </div>
    )
}

export default HotelInvoice
