import React, { useState } from "react";
import Boisson from "../../assets/default/boisson.png";
import Nourriture from "../../assets/default/nourriture.png";
import CustomModal from "../../components/customModal";
import StyledButton from "../../components/styledButton";
import SimpleButton from "../../components/simpleButton";
import { toast } from "react-toastify";
import { addItemUpdate, createItem, deleteItem, updateItem } from "../../api/item";
import { confirmAlert } from "react-confirm-alert";
import NormalButton from "../../components/normalButton";

function ItemsAdmin({ items, setPending, setItems }) {
  const [current, setCurrent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewIndex, setViewIndex] = useState(0);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [foodtype, setType] = useState("");
  const [hasStock, setHasStock] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const [stockValue, setStockValue] = useState(0);

  function closeModal() {
    setIsOpen(false);
    setCurrent(null);
    setName("");
    setType("");
    setPrice("");
    setDesc("");
    setQuantity(0);
    setHasStock(false);
  }

  function openModal(i, data) {
    console.log(data);
    setIsOpen(true);
    setViewIndex(i);
    setCurrent(data);
    if (i === 0) {
      setName(data?.name);
      setDesc(data?.description);
      setPrice(data?.price?.toString());
      setType(data?.type);
      setHasStock(data?.hasStock);
      setQuantity(data?.quantity)
    }
  }

  function updateItemsContext(new_item) {
    const items_list = items.filter((target) => target._id !== new_item._id);
    setItems([...items_list, new_item]);
  }

  function deleteItemsContext(id) {
    const items_list = items.filter((target) => target._id !== id);
    setItems([...items_list]);
  }

  function addItemsContext(new_item){
    setItems([new_item, ...items]);
  }

  async function updateProduct(e) {
    e.preventDefault()
    if (!name || !price || !foodtype || !desc) {
      return toast.warn("Formulaire incomplet");
    }

    if (Number(price) < 1) {
      return toast.warn("le prix ne peux pas etre inferieur a 1");
    }

    try {
      setPending(true);
      const res = await updateItem({
        id: current._id,
        name: name,
        description: desc,
        price: Number(price),
        type: foodtype,
        quantity: quantity,
        hasStock: hasStock,
      });
      if (res.success) {
        toast.success("Produit modifié ! 😉");
        closeModal();
        updateItemsContext(res.item);
        setPending(false);
      } else {
        toast.error(res.message || "Erreur ! Verifier votre connexion");
        setPending(false);
      }
    } catch (err) {
      toast.error(
        err.message || "Erreur! Verifier votre connexion, Serveur Indisponible"
      );
      setPending(false);
    }
  }

  async function itemUpdateStock(e) {
    e.preventDefault()
    if (!stockValue) {
      return toast.warn("entrez la quantité a ajouter");
    }

    if (Number(stockValue) < 1) {
      return toast.warn("la quantité ne peux pas etre inferieur a 1");
    }

    try {
      setPending(true);
      const res = await addItemUpdate({
        id: current._id,
        offset: Number(stockValue)
      });
      if (res.success) {
        toast.success("stock modifié ! 😉");
        closeModal();
        setStockValue(0);
        setPending(false);
      } else {
        toast.error(res.message || "Erreur ! Verifier votre connexion");
        setPending(false);
      }
    } catch (err) {
      toast.error(
        err.message || "Erreur! Verifier votre connexion, Serveur Indisponible"
      );
      setPending(false);
    }
  }

  async function addItem(e) {
    e.preventDefault()

    if (!name || !price || !foodtype || !desc) {
      return toast.warn("Formulaire incomplet");
    }

    if (Number(price) < 1) {
      return toast.warn("le prix ne peux pas etre inferieur a 1");
    }

    try {
      setPending(true);
      const res = await createItem({
        name: name,
        description: desc,
        price: Number(price),
        type: foodtype,
        quantity: quantity,
        hasStock: hasStock
      });
      if (res.success) {
        toast.success("Produit ajouté ! 😉");
        closeModal();
        addItemsContext(res.item);
        setPending(false);
        
      } else {
        toast.error(res.message || "Erreur ! Verifier votre connexion");
        setPending(false);
      }
    } catch (err) {
      toast.error(
        err.message || "Erreur! Verifier votre connexion, Serveur Indisponible"
      );
      setPending(false);
    }
  }

  function deleteProduct(id, name) {
    confirmAlert({
        title: `Confirmation de supprimé`,
        message: `Etes vous sur de vouloir supprimé le produit avec comme ID ${id} et nom ${name}?`,
        buttons: [
            {
                label: "Oui",
                onClick: async() => {
                    try{
                        setPending(true);
                        const res = await deleteItem(id);
                        if(res.success){
                            setPending(false);
                            deleteItemsContext(id);
                            toast.success("Produit supprimé")
                        }else{
                            // console.log(res)
                            toast.error(
                                res.message || "Erreur! Verifier votre connexion, Serveur Indisponible"
                            );
                            setPending(false);
                        }
                    }catch(err){
                        toast.error(
                            err.message || "Erreur! Verifier votre connexion, Ou bien cette facture existe deja !"
                          );
                        setPending(false);
                    }
                }
            },
            {
                label: "Non",
                onClick: () => toast("ouff 😮‍💨")

            }
        ]
    })  
  }

  return (
    <>
      <div>
        <div className="admin-table">
            <div className="center-x">
                <SimpleButton onClick={() => openModal(1, {})} text="Ajouter +"/>
            </div>
          <div className="table-container">
            <div className="caption">Liste des nourritures et boissons</div>
            <table>
              <thead>
                <tr>
                  <th>N° </th>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Quantité</th>
                  <th>Description</th>
                  <th> </th>
                  <th> </th>

                </tr>
              </thead>
              <tbody>
                {items.map((food, index) => {
                  return (
                    <tr key={food._id}>
                      <td>{index + 1}</td>
                      <td>
                        {" "}
                        <img
                          src={
                            food.image
                              ? food.image
                              : food.type === "nourriture"
                              ? Nourriture
                              : Boisson
                          }
                          className="table-image"
                          alt="food image"
                        />{" "}
                      </td>
                      <td>{food.name}</td>
                      <td>{food.price} $</td>
                      <td>{food.quantity} {food.hasStock ? "pcs" : "🚫"}</td>
                      <td>
                        {" "}
                        {food.description.substr(0, 10)}{" "}
                        {food.description.length > 10 && "..."}
                      </td>
                      <td>
                        {" "}
                        <SimpleButton
                          onClick={() => openModal(0, food)}
                          text="modifier"
                        />
                      </td>
                      <td>
                        <NormalButton onClick={() => deleteProduct(food._id, food.name)} text="supprimé" color="danger"/>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <hr />
      </div>
      <CustomModal isOpen={isOpen} closeModal={closeModal}>
        <h4 className="text-center ideal-grill-text">MAMAN KINJA</h4>
        {viewIndex === 0 ? (
          <>
            <p className="text-center">Modifier le produit</p>
            <form onSubmit={updateProduct} className="form-modal">
              <input
                className="form-control m-2"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="nom"
                required
              />
              <input
                className="form-control m-2"
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="description"
                required
              />
              <input
                className="form-control m-2"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="prix"
                required
              />
              <select
                value={foodtype}
                onChange={(e) => setType(e.target.value)}
                className="input-control elegant-select"
                required
              >
                <option value="">~ SELECTIONER ~</option>
                <option value="nourriture">NOURRITURE</option>
                <option value="boisson">BOISSON</option>
              </select>
              <div style={{display: "flex", justifyContent: "space-around", alignItems: 'center'}}>
                <label htmlFor="checkbox">
                  Gestion stock : 
                </label>
              <input
                style={{width: "30px", height: "30px"}}
                className=" m-2"
                type="checkbox"
                id="checkbox"
                name="checkbox"
                checked={hasStock}
                onChange={(e) => setHasStock(!hasStock)}
                placeholder="Gestion Stock"
                required
              />
              </div>
              <div className="center-x mt-4">
                <StyledButton
                  type="submit"
                  onClick={() => {}}
                  text="Modifier"
                />
              </div>
            </form>

            {hasStock  && <form onSubmit={itemUpdateStock} className="">
              <br/>

              <h4 className="text-center">Ajouter Stock</h4>
              <div className="center-x">
              <input min="0" type="number" value={stockValue} onChange={(e)=>setStockValue(e.target.value)} placeholder="quantité" />
              </div>            
              <div className="center-x mt-4">
                <StyledButton
                  type="submit"
                  onClick={() => {}}
                  text="Ajouter Stock"
                />
              </div>
            </form>}
          </>
        ) : (
          <>
            <p className="text-center">Ajouter le produit</p>
            <form onSubmit={addItem}>
              <input
                className="form-control m-2"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="nom"
                required
              />
              <input
                className="form-control m-2"
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="description"
                required
              />
              <input
                className="form-control m-2"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="prix"
                required
              />
              <select
                value={foodtype}
                onChange={(e) => setType(e.target.value)}
                className="input-control elegant-select"
                required
              >
                <option value="">~ SELECTIONER ~</option>
                <option value="nourriture">NOURRITURE</option>
                <option value="boisson">BOISSON</option>
              </select>
              <div style={{display: "flex", justifyContent: "space-around", alignItems: 'center'}}>
                <label htmlFor="checkbox">
                  Gestion stock : 
                </label>
              <input
                style={{width: "30px", height: "30px"}}
                className=" m-2"
                type="checkbox"
                id="checkbox"
                name="checkbox"
                checked={hasStock}
                onChange={(e) => setHasStock(!hasStock)}
                placeholder="Gestion Stock"
                required
              />
              </div>
              {
                hasStock && <div style={{display: "flex", justifyContent: "space-around", alignItems: 'center'}}>
                <label htmlFor="quantity">
                 Quantité: 
                </label>
              <input
                className=" m-2"
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantité"
                required
              />
              </div>
              }
              <div className="center-x mt-4">
                <StyledButton
                  type="submit"
                  onClick={() => {}}
                  text="Ajouter"
                />
              </div>
            </form>
          </>
        )}
      </CustomModal>
    </>
  );
}

export default ItemsAdmin;
