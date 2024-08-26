import React, { useEffect, useState } from "react";
import NormalButton from "../components/normalButton";
import { toast } from "react-toastify";
import { logoutUser } from "../api/user";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import ItemsGrid from "../components/itemsGrid";
import { useIdeal } from "../context";
import StyledButton from "../components/styledButton";
import TablesGrid from "../components/TablesGrid";
import SelectWaiter from "../components/selectWaiter";
import FloatingButton from "../components/floatingButton";
import { createOrder } from "../api/order";
import OrdersList from "../components/commandList";
import BillsList from "../components/billsList";

function HomePage() {
  const navigate = useNavigate();
  const [openPanel, setOpenPanel] = useState(false);
  const { setPending, pending, fetchOrders, userInfo, items, cart, setCart } = useIdeal();
  const [currentTab, setTab] = useState(0);
  const [waiter, setWaiter] = useState(userInfo?._id);
  const [searchKey, setSearchKey] = useState("");
  const [table, setTable] = useState("");
  // console.log(userInfo)

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await logoutUser();
      if (res?.success) {
        toast.success("Utilisateur deconnecté");
        localStorage.removeItem("userInfo");
        navigate("/");
      }
    } catch (err) {
      toast.error("Erreur!");
    }
  };

  function getTotal(cart_items) {
    let amount = 0;
    cart_items.map((single_item) => {
      amount += Number(single_item.total);
    });
    return amount;
  }

  function removeToCart(id) {
    let new_cart = { ...cart };
    new_cart.items = new_cart.items.filter(
      (singleitem) => singleitem.id !== id
    );
    new_cart.total = getTotal(new_cart.items);
    setCart(new_cart);
    localStorage.setItem("idealCart", JSON.stringify(new_cart));
  }

  function addToCart(item, quantity) {
    setOpenPanel(true);

    let new_cart = { ...cart };
    var found = false;

    new_cart.items.map((single_item) => {
      if (single_item.id === item._id) {
        found = true;
      }
    });
    if (!found) {
      new_cart.items.push({
        id: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(quantity),
        total: Number(item.price) * Number(quantity),
      });
      new_cart.total = getTotal(new_cart.items);
    } else {
      new_cart.items.map((single_item) => {
        if (single_item.id === item._id) {
          single_item.quantity = Number(quantity);
          single_item.total = Number(quantity) * Number(single_item.price);
        }
      });
      new_cart.total = getTotal(new_cart.items);
    }

    setCart(new_cart);
    localStorage.setItem("idealCart", JSON.stringify(new_cart));
  }


  async function ConfirmOrder() {
    if(table === ""){
      return toast.warn("Erreur, Selectionner une table");
    }
    if(waiter === ""){
      return toast.warn("Erreur, Selectionner un serveur");
    }
    if(cart.items.length === 0){
      return toast.warn("Erreur, Ajouter un produit dans votre panier d'abord avant de passer une commande");
    }

    console.log(waiter);

    try{
      setPending(true);
      const res = await createOrder(
        {
          items: cart.items,
          table: table,
          waiter: waiter,
          total: cart.total
        }
      );
      if(res?.success){
        toast.success("Votre commande a bien été reçue !")
        setPending(false);
        setCart({
            items: [],
            total: 0,
            payementType: "",
            waiter: "",
            table: "",
            clientName: "",
            clientNumber: "",
        })
        setTable("");
        setTab(1);
        setOpenPanel(false);
        fetchOrders();
      } else{
        toast.error("Erreur! Verifier votre connexion ou bien reconnectez-vous!");
        setPending(false);
      }
    }catch(err){
      toast.error("Erreur! Verifier votre connexion ou bien reconnectez-vous!");
      setPending(false);
    }
  }


  useEffect(() => {
    setWaiter(userInfo?._id);
  }, [userInfo])

  return (
    <section className="home-section">
      <FloatingButton setOpenPanel={setOpenPanel}/>
      <div
        id="mySidepanel"
        style={{ zIndex: "99", width: openPanel ? "400px" : "0px" }}
        className="sidepanel"
    
      >
        <div className="p-2">
          <div className="d-flex" style={{justifyContent: "flex-end"}}>
            <button onClick={() => setOpenPanel(false)} className="btn btn-warning" style={{fontWeight: "bold", fontSize: "20px"}}>x</button>
          </div>
          <h4 className="text-center" style={{ color: "white" }}>
            Panier
          </h4>
          <hr style={{ color: "white" }} />
          <div>
            <SelectWaiter waiter={waiter} setWaiter={setWaiter} />
          </div>
          <ul className="tile-list">
            {cart.items.map((carting) => {
              return (
                <li
                  className="tile-cart d-flex"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={carting?.name}
                >
                  <div>
                    {carting?.name} -{" "}
                    <span
                      style={{
                        fontSize: "14px",
                        textTransform: "capitalize",
                        color: "#72b2ff",
                      }}
                    >
                      {carting.quantity} pcs
                    </span>
                  </div>
                  <span>{carting?.price} $</span>
                  <button
                    onClick={() => removeToCart(carting.id)}
                    className="btn btn-danger"
                  >
                    X
                  </button>
                </li>
              );
            })}
            <li>
              <hr style={{ color: "white" }} />
              <h4>
                Total: <span style={{ fontSize: "30px" }}>{cart.total}</span> $
              </h4>
              <hr className="mt-2 mb-2" style={{ color: "white" }} />

            </li>
          </ul>
          <div className="center-x">
            <StyledButton text="Confirmer" onClick={() => ConfirmOrder()}/>
          </div>
        </div>
      </div>
      <div style={{ width: "100vw" }}>
        <div>
          <ul className="nav nav-pills nav-fill m-2">
            <li onClick={() => setTab(0)} className="nav-item">
              <span
                style={{ cursor: "pointer" }}
                className={`nav-link ${currentTab === 0 ? "active" : ""}`}
                aria-current="page"
              >
                Comptoir
              </span>
            </li>
            <li onClick={() => setTab(1)} className="nav-item">
              <span
                style={{ cursor: "pointer" }}
                className={`nav-link ${currentTab === 1 ? "active" : ""}`}
              >
                Commandes
              </span>
            </li>
            <li onClick={() => setTab(2)} className="nav-item">
              <span
                style={{ cursor: "pointer" }}
                className={`nav-link ${currentTab === 2 ? "active" : ""}`}
              >
                Factures
              </span>
            </li>
            {(userInfo?.role === "admin" || userInfo?.role === "dev") && (
              <li className="nav-item">
                <Link
                  to="/admin"
                  style={{ cursor: "pointer" }}
                  className="nav-link "
                  aria-disabled="true"
                >
                  Admin
                </Link>
              </li>
            )}
            <li className="nav-item">
              <NormalButton
                onClick={handleLogout}
                text="Se Deconnecter"
                color="danger"
              />
            </li>
          </ul>
        </div>
        {
          currentTab === 0 && <>
          <div className="search-input-container m-3 gap-2">
                  <input className="search-input" placeholder="recherche" value={searchKey} onChange={(e) => setSearchKey(e.target.value)}/>
                  <button onClick={() => setSearchKey("")} className="btn btn-warning">Annuler</button>
          </div>
          <div className="container">
            <TablesGrid selectedTable={table} setSelectedTable={setTable}/>
          </div>
          <ItemsGrid
            addToCart={addToCart}
            items={
              searchKey === ""
                ? items
                : items.filter((product) =>
                    product.name.toLowerCase().includes(searchKey.toLowerCase())
                  )
            }
          />
          </>
        }
        {
          currentTab === 1 && <div className="container">
            <OrdersList/>
          </div>
        }

      {
          currentTab === 2 && <div className="container">
            <BillsList/>        
          </div>
        }
      </div>
    </section>
  );
}

export default HomePage;
