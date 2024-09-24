import React, { useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIdeal } from "../context";
import dateformat from "dateformat";

function SingleInventory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inventories, items } = useIdeal();
  const current = inventories.filter((inv) => inv._id === id)[0];
  const bills = current?.activities;
  const [reportData, setReportData] = useState({});

  const getTotal = (mylist) => {
    let mytotal = 0;
    mylist.map((inv) => {
      mytotal += Number(inv.total);
    });
    return mytotal;
  };

  const getUpdatedItemsData = (inv_data) => {
    if(inv_data === undefined) return
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
            ? Number(
                item_data[sold_items[x].id]?.quantity + sold_items[x].quantity
              ) * Number(sold_items[x].price)
            : Number(sold_items[x].quantity) * Number(sold_items[x].price),
        };
      }
    }
    // console.log(item_data);
    // return item_data;
    setReportData(item_data);
    return item_data;
  };

  function datetostring(new_date) {
    return dateformat(new_date, "dd/mm/yyyy");
  }

  useEffect(() => {
    getUpdatedItemsData(bills);
  }, [inventories])

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          margin: "10px",
        }}
      >
        <button
          className="btn btn-danger"
          onClick={() => navigate("/admin")}
          fontSize="15px"
        >
          {" "}
          ⬅️ Retour
        </button>
      </div>
      <hr />
      <>
        <div className="center-x">
          <h2>Inventaire ~ {datetostring(current?.createdAt)}</h2>
        </div>
        <hr style={{ color: "gray" }} />
        {/* {
                invoices.map(invoice => <span key={invoice._id}>{invoice._id}</span>)
            } */}
        {bills?.length > 0 ? (
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
                        <th>quantité Vendu</th>
                        <th>Reste Stock</th>
                        <th>Prix unitaire</th>
                        <th>Total</th>
                        {/* <th>Stock</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(reportData).map((rprt, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{reportData[rprt]?.name}</td>
                            <td>{reportData[rprt]?.quantity}</td>
                            <td>{items.filter(itm => itm?._id === reportData[rprt].id)[0]?.quantity ?  items.filter(itm => itm?._id === reportData[rprt].id)[0]?.quantity : "🚫"}</td>
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
                    {getTotal(bills)} $
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
      </>
    </div>
  );
}

export default SingleInventory;
