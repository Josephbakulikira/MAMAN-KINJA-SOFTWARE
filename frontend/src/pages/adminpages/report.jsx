import React, { useEffect, useState } from "react";
import "../../styles/admin.css";
import { Link, useParams } from "react-router-dom";
import { useIdeal } from "../../context";
import dateFormat from "dateformat";

function ReportPage() {
  const { bills, date, users, items } = useIdeal();
  const [invoices, setInvoices] = useState([]);
  const [usersDict, setUsersDict] = useState({});
  const [reportData, setReportData] = useState({});

  function datetostring(new_date) {
    return dateFormat(new_date, "dd/mm/yyyy");
  }

  function getDateBills(new_date) {
    let offset = datetostring(new_date);
    const new_bills = bills.filter((single_bill) => {
    //   console.log(datetostring(single_bill.createdAt), offset);
      return datetostring(single_bill.createdAt) === offset;
    });
    // console.log(offset);
    setInvoices(new_bills);
    // console.log(new_bills);
    getUpdatedItemsData(new_bills);
    // console.log(new_bills)
  }

  function generateUsersDict() {
    let users_dict = {};
    for (let i = 0; i < users.length; i++) {
      users_dict[users[i]._id] = users[i].name;
    }

    setUsersDict(users_dict);
  }

  const getTotal = (mylist) => {
    let mytotal = 0;
    mylist.map((inv) => {
      mytotal += Number(inv.total);
    });
    return mytotal;
  };

  const getUpdatedItemsData = (inv_data) => {
    let item_data = {};
    for (let j = 0; j < inv_data.length; j++) {
      let sold_items = inv_data[j].items;
      for (let x = 0; x < sold_items.length; x++) {
        item_data[sold_items[x].id] = {
          id: sold_items[x].id,
          name: sold_items[x].name,
          
          quantity: item_data[sold_items[x].id]?.quantity
            ? item_data[sold_items[x].id]?.quantity + sold_items[x].quantity
            : sold_items[x].quantity,

          price: sold_items[x].price,
          total: item_data[sold_items[x].id]?.quantity
          ? Number(item_data[sold_items[x].id]?.quantity + sold_items[x].quantity) * Number(sold_items[x].price)
          : Number(sold_items[x].quantity) * Number(sold_items[x].price),
        };
      }
    }
    // console.log(item_data);
    // return item_data;
    setReportData(item_data);
    return item_data;
  };

  useEffect(() => {
    generateUsersDict();
  }, []);

  useEffect(() => {
    getDateBills(date);
  }, [bills, date]);

  return (
    <div>
      <div className="d-flex m-3" style={{ justifyContent: "flex-end" }}>
        <Link className="btn btn-danger" to="/admin">
          {"<"} Retour{" "}
        </Link>
      </div>
      <div className="center-x">
        <h2>Inventaire ~ {datetostring(date)}</h2>
      </div>
      <hr style={{ color: "gray" }} />
      {/* {
                invoices.map(invoice => <span key={invoice._id}>{invoice._id}</span>)
            } */}
      {invoices.length > 0 ? (
        <>
          <h4 className="text-center m-2">Rapport Comptoir</h4>
          <div className="container">
            <div className="admin-table ">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th>produit</th>
                      <th>quantité</th>
                      <th>Prix unitaire</th>
                      <th>Total</th>
                      {/* <th>Stock</th> */}
                    </tr>
                  </thead>
                  <tbody>
                        {Object.keys(reportData).map((rprt, idx) => {
                            return (
                            <tr key={idx}>
                                <td>{idx+1}</td>
                                <td>{reportData[rprt]?.name}</td>
                                <td>{reportData[rprt]?.quantity}</td>
                                <td>{reportData[rprt]?.price} $</td>
                                <td>{reportData[rprt]?.total} $</td>
                            </tr>
                            );
                        })}
                  </tbody>
                </table>
              </div>
              <div className="m-3">
                <h1
                  className="text-success text-center badge"
                  style={{ fontSize: "50px", letterSpacing: "4px" }}
                >
                  <span className="text-dark" style={{ fontSize: "50px" }}>
                    Total:
                  </span>
                  {getTotal(invoices)} $
                </h1>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="container">
          <h2>Pas disponible</h2>
        </div>
      )}
    </div>
  );
}

export default ReportPage;
