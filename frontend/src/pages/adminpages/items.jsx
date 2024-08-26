import React, { useState } from "react";
import Boisson from "../../assets/default/boisson.png";
import Nourriture from "../../assets/default/nourriture.png";
import CustomModal from "../../components/customModal";
import StyledButton from "../../components/styledButton";
import SimpleButton from "../../components/simpleButton";
import { toast } from "react-toastify";
import { createItem, deleteItem, updateItem } from "../../api/item";
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

  function closeModal() {
    setIsOpen(false);
    setCurrent(null);
    setName("");
    setType("");
    setPrice("");
    setDesc("");
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
              <div className="center-x mt-4">
                <StyledButton
                  type="submit"
                  onClick={() => {}}
                  text="Modifier"
                />
              </div>
            </form>
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
