import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/admin.css";
import SimpleButton from "../../components/simpleButton";
import StyledButton from "../../components/styledButton";
import { Link, useNavigate } from "react-router-dom";
import { useIdeal } from "../../context";
import { toast } from "react-toastify";
import { generateInventory, getAllInventories } from "../../api/inventory";
import dateformat from 'dateformat';

function InventoryAdmin() {
  const [seekDate, setSeekDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const {inventories, setInventories} = useIdeal()
  const navigate = useNavigate();
  const { setDate } = useIdeal();

  function handleOnclick() {
    setDate(seekDate);
    navigate("/admin/report");
  }

  async function generatingNewInventory() {
    try {
      const res = await generateInventory({ description });
      if (res?.success) {
        setDescription("");
        toast.success("Inventaire generé");
        fetchInventories();
      } else {
        console.log(res);
        toast.error(
          "Error, verifier votre connection ou bien il ya pas de facture disponible"
        );
      }
    } catch (error) {
      toast.error(error.message || error || "Erreur");
    }
  }

  const fetchInventories = async () => {
    try {
      const res = await getAllInventories();
      if (res?.success) {
        setInventories(res.inventories);
      } else {
        toast.warn("Error! Verifier votre connexion svp avant de continuer");
      }
    } catch (error) {
      toast.error(error.message || "Error, fetching inventories");
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  return (
    <div
      className="center-x"
      style={{ display: "grid", gridTemplateColumns: "repeat(1, auto)" }}
    >
      <h4>Selectionner une date</h4>
      <Calendar value={seekDate} onChange={setSeekDate} />
      <br />
      <StyledButton onClick={handleOnclick} text="Voir Rapport" />
      <hr />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <textarea
            style={{ minWidth: "400px" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="une petite description sur cet inventaire"
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SimpleButton
              onClick={generatingNewInventory}
              text="GENERER INVENTAIRE"
            />
          </div>
        </div>
      </div>
      <hr />
      <div style={{display: "grid", justifyContent: 'center', }}>
        {inventories.map((sing_inv) => {
          return <Link to={`/administrator/inventories/${sing_inv?._id}`} key={sing_inv?._id} style={{fontWeight: "bold", fontSize: "20px", border: "1px solid gray", borderRadius: "12px", paddingBlock: "14px", marginBlock: "8px", paddingInline: "8px"}}>
            {dateformat(new Date(sing_inv?.createdAt), "dd/mm/yyyy   HH:MM")} ➡️
          </Link>;
        })}
      </div>
    </div>
  );
}

export default InventoryAdmin;
