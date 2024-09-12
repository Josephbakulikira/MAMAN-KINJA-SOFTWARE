import React, { useState } from "react";
import StyledButton from "../../components/styledButton";
import SimpleButton from "../../components/simpleButton";
import NormalButton from "../../components/normalButton";
import { createClient, deleteClient, updateClient, updateClientHistory } from "../../api/clientuser";
import { toast } from "react-toastify";
import CustomModal from "../../components/customModal";
import { useIdeal } from "../../context";
import dateFormat from "dateformat";
import HotelInvoice from "../../components/hotelInvoice";

function ClientsPanel() {
  const { clients, setClients, setPending, rooms, setRooms, fetchClients} = useIdeal();
  const [new_client, setNewClient] = useState({email: "flatrestomamankinja@gmail.com"});
  const [current, setCurrent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewIndex, setViewIndex] = useState(0);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");

  function handlechangeClient(keyword, value){
    setNewClient({...new_client, [keyword]: value})
  }

  function handleChangeCurrent(keyword, value){
    setCurrent({...current, [keyword]: value})
  }

  function closeModal() {
    setIsOpen(false);
    setCurrent(null);
    // setNewClient(null);
  }

  function openModal(i, data) {
    // console.log(data);
    setIsOpen(true);
    setViewIndex(i);
    setCurrent(data);
    if (i === 0) {
      setNewClient(data);
    }
  }

  async function deleteClientAsAdmin(client_id) {
    
    try {
      setPending(true);
      const response = await deleteClient({ client_id });
      if (response.success) {
        setPending(false);
        toast.success(response?.message || "OK");
        setClients(clients.filter((item) => item._id !== client_id));
        
      } else {
        setPending(false);
        toast.error(response?.message || "Erreur!");
      }
    } catch (error) {
      setPending(false);
      toast.error(error?.message || "Erreur! Verifier votre connexion")
    }
  }

  async function updateClientData(e){
    e.preventDefault();
    const difftime = Math.abs(new Date(current?.checkIn) - new Date(current?.checkOut));
    const diffDays = Math.floor(difftime/(1000 * 60 * 60 * 24));

    const room_price = rooms?.filter(item => current?.roomNumber === item.name)[0]?.price;
    try {
      setPending(true);
      const response = await updateClient({ checkIn: current?.checkIn, checkOut: current?.checkOut, roomNumber: current?.roomNumber, client_id: current?._id, total: Number(diffDays) * Number(room_price), days: Number(diffDays) });
      if (response.success) {
        setPending(false);
        toast.success(response?.message || "OK");
        fetchClients();
        closeModal();
      } else {
        setPending(false);
        toast.error(response?.message || "Erreur!");
      }
    } catch (error) {
      setPending(false);
      toast.error(error?.message || "Erreur! Verifier votre connexion")
    }
  }

  async function addNewClient(e) {
    e.preventDefault();

    const difftime = Math.abs(new Date(new_client?.checkIn) - new Date(new_client?.checkOut));
    const diffDays = Math.floor(difftime/(1000 * 60 * 60 * 24));

    const room_price = rooms?.filter(item => new_client?.roomNumber === item.name)[0]?.price;

    try {
      setPending(true);
      const response = await createClient({...new_client, ["total"]: Number(diffDays) * Number(room_price), ["days"]: Number(diffDays)});
      if (response.success) {
        setPending(false);
        toast.success(response?.message || "OK");
        // console.log(response)
        setClients([...clients, response.client]);
        let filtered_rooms = rooms.filter(rmm => rmm.name !== response.room.name)
        setRooms([...filtered_rooms, response.room])
        closeModal();
        setNewClient({email: "flatrestomamankinja@gmail.com"})
      } else {
        setPending(false);
        toast.error(response?.message || "Erreur!");
      }
    } catch (error) {
      setPending(false);
      toast.error(error?.message || "Erreur! Verifier votre connexion")
    }
  }

  async function UpdatePayment(e) {
    // amount, description, client_id
    e.preventDefault();

    try {
      setPending(true);
      const response = await updateClientHistory({amount: amount, description: description, client_id: current?._id});
      if (response.success) {
        setPending(false);
        toast.success(response?.message || "OK");
        // console.log(response)
        // setClients([...clients, response.client]);
        fetchClients();
        closeModal();
      } else {
        setPending(false);
        toast.error(response?.message || "Erreur!");
      }
    } catch (error) {
      setPending(false);
      toast.error(error?.message || "Erreur! Verifier votre connexion")
    }
  }

  function getBgColorOfClient(checkIn, checkOut){
    let colors = {
      booked: "#cefac3",
      checkedIn: "#c3dffa",
      checkedOut: "#fac3c3"
    }
    let c_color = colors.booked;
    if(new Date(checkIn).valueOf() > new Date().valueOf()){
      c_color = colors.booked;
    }
    else if (new Date(checkIn).valueOf() <= new Date().valueOf()){
      c_color = colors.checkedIn;
    }
    else if (new Date(checkOut).valueOf() <= new Date().valueOf()){
      c_color = colors.checkedOut;
    }

    return c_color;
  }

  return (
    <>
      <div>
        <div className="admin-table">
          <div className="center-x">
            <SimpleButton onClick={() => openModal(1, {})} text="Ajouter +" />
          </div>
          <div className="table-container">
            <div className="caption">Liste des clients</div>
            <div style={{display: "flex", justifyContent: 'start', alignItems: 'center', gap: "10px"}}>
              <div style={{whiteSpace: 'nowrap', display: "flex", alignItems: "center"}}>
                <div style={{width: "30px", borderRadius: "15px", height: "30px", background: "#cefac3"}}>
                </div> : Booked
              </div>
              <div style={{whiteSpace: 'nowrap', display: "flex", alignItems: "center"}}>
                <div style={{width: "30px", borderRadius: "15px", height: "30px", background: "#c3dffa"}}>
                </div> : Checked-in
              </div>
              <div style={{whiteSpace: 'nowrap', display: "flex", alignItems: "center"}}>
                <div style={{width: "30px", borderRadius: "15px", height: "30px", background: "#fac3c3"}}>
                </div> : Checked-out
              </div>
            </div>
            <br/>
            <table>
              <thead>
                <tr>
                  <th>N° </th>
                  <th></th>

                  <th>Nom & Postnom</th>
                  <th>Numero de telephone</th>
                  <th>Email</th>
                  <th>ID</th>
                  <th>N° chambre</th>
                  <th>check-In</th>
                  <th>check-Out</th>
                  <th>Jours</th>
                  <th>Total a payer</th>
                  <th>Total Payé</th>
                  <th>Reste a Payer</th>

                  <th>View</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {clients?.map((item, index) => {
                  return (
                    <tr style={{background: getBgColorOfClient(item?.checkIn, item?.checkOut)}} key={item._id}>
                      <td>{index + 1}</td>
                      <td><NormalButton
                          onClick={() => openModal(4, item)}
                          text="🖨️"
                          color="secondary"
                        /></td>
                      <td>{item?.fullname}</td>
                      <td>{item?.phoneNumber}</td>
                      <td>{item?.email}</td>
                      <td>{item?.identityCardNumber}</td>
                      <td>{item?.roomNumber}</td>
                      <td>{dateFormat(new Date(item?.checkIn), "dd/mm/yyyy  -  HH:MM")}</td>
                      <td>{dateFormat(new Date(item?.checkOut), "dd/mm/yyyy -  HH:MM")}</td>
                      <td>{item?.days} jr(s)</td>
                      <td style={{color: "red"}}>{item?.total} $</td>
                      <td style={{color: "teal"}}>{item?.balance} $</td>
                      <td style={{color: Number(item?.total) - Number(item?.balance) > 0 ? "red" : "green"}}>{Number(item?.total) - Number(item?.balance)} $</td>
                      <td>
                        {" "}
                        <SimpleButton
                          onClick={() => openModal(2, item)}
                          fontSize="20px"
                          text="👁️"
                        />
                      </td>
                      <td>
                        {" "}
                        <SimpleButton
                          onClick={() => openModal(0, item)}
                          fontSize="20px"

                          text="✏️"
                        />
                      </td>
                      <td>
                        <NormalButton
                          onClick={() => deleteClientAsAdmin(item._id)}
                          text="supprimé"
                          color="danger"
                        />
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
        {viewIndex === 0 ? (
          <>
          <h4 className="text-center ideal-grill-text">MAMAN KINJA</h4>

            <p className="text-center">Modifier le client</p>
            <form onSubmit={updateClientData} className="form-modal">
              <div className="center-x mt-4">

                <input
                  className="form-control m-2"
                  type="date"
                  value={current?.checkIn}
                  onChange={(e) => handleChangeCurrent("checkIn", e.target.value)}
                  placeholder="Check-In"
                  min={dateFormat(Date(), "yyyy-mm-dd")}
                  required
                />
              </div>
              <div className="center-x mt-4">
                <input
                  className="form-control m-2"
                  type="date"
                  value={current?.checkOut}
                  onChange={(e) => handleChangeCurrent("checkOut", e.target.value)}
                  placeholder="Check-out"
                  min={dateFormat(current?.checkIn ? new Date().setDate(new Date(current?.checkIn).getDate() + 1) : Date(), "yyyy-mm-dd")}
                  required
                /></div>
                <div className="center-x mt-4">
                <select className="form-control m-2" value={current?.roomNumber}
                onChange={(e) => handlechangeClient("roomNumber", e.target.value)} required>
                  <option value=""> ~ </option>
                {rooms?.map((single_room, index) => {
                  // if (single_room.available)
                    return <option key={single_room._id} value={single_room.name}>{single_room.name}</option>
                })}
              </select>

              </div>
              <div className="center-x mt-4">
                <StyledButton
                  type="submit"
                  onClick={updateClientData}
                  text="Modifier"
                />
              </div>
            </form>
          </>
        ) : viewIndex === 1 ? (
          <>
        <h4 className="text-center ideal-grill-text">MAMAN KINJA</h4>

            <p className="text-center">Ajouter un Client</p>
            <form onSubmit={addNewClient}>
              <input
                className="form-control m-2"
                type="text"
                value={new_client?.fullname}
                onChange={(e) => handlechangeClient("fullname", e.target.value)}
                placeholder="nom"
                required
              />
              <input
                className="form-control m-2"
                type="text"
                value={new_client?.address}
                onChange={(e) => handlechangeClient("address", e.target.value)}
                placeholder="adresse"
                required
              />
              <select className="form-control m-2" value={new_client?.identityCard}
                onChange={(e) => handlechangeClient("identityCard", e.target.value)} required>
                <option value="">~</option>
                <option value="passport">PASSEPORT</option>
                <option value="carte d'electeur">CARTE D'ELECTEUR</option>
                <option value="permis de conduire">PERMIS DE CONDUIRE</option>
                <option value="autres">AUTRES</option>
              </select>
              <input
                className="form-control m-2"
                type="text"
                value={new_client?.identityCardNumber}
                onChange={(e) => handlechangeClient("identityCardNumber", e.target.value)}
                placeholder="Numero carte d'identité"
                required
              />
              <input
                className="form-control m-2"
                type="number"
                value={new_client?.phoneNumber}
                onChange={(e) => handlechangeClient("phoneNumber", e.target.value)}
                placeholder="Numero de telephone"
                required
              />
              <input
                className="form-control m-2"
                type="email"
                value={new_client?.email}
                onChange={(e) => handlechangeClient("email", e.target.value)}
                placeholder="Email (johndoe@gmail.com)"
                required
              />
              <input
                className="form-control m-2"
                type="number"
                value={new_client?.balance}
                onChange={(e) => handlechangeClient("balance", e.target.value)}
                placeholder="Balance ($)"
                required
              />
              <input
                className="form-control m-2"
                type="date"
                value={new_client?.checkIn}
                onChange={(e) => handlechangeClient("checkIn", e.target.value)}
                placeholder="Check-In"
                min={dateFormat(Date(), "yyyy-mm-dd")}
                required
              />
              <input
                className="form-control m-2"
                type="date"
                value={new_client?.checkOut}
                onChange={(e) => handlechangeClient("checkOut", e.target.value)}
                placeholder="Check-out"
                min={dateFormat(new_client?.checkIn ? new Date().setDate(new Date(new_client?.checkIn).getDate() + 1) : Date(), "yyyy-mm-dd")}
                required
              />

              <select className="form-control m-2" value={new_client?.roomNumber}
                onChange={(e) => handlechangeClient("roomNumber", e.target.value)} required>
                  <option value=""> ~ </option>
                {rooms?.map((single_room, index) => {
                  // if (single_room.available)
                    return <option key={single_room._id} value={single_room.name}>{single_room.name} ~ <span style={{color: "#aaa"}}>{dateFormat(single_room?.checkIn, "dd-mm-yyyy")} - {dateFormat(single_room?.checkOut, "dd-mm-yyyy")}</span> </option>
                })}
              </select>
              
              <div className="center-x mt-4">
                <StyledButton type="submit" onClick={() => {}} text="Ajouter" />
              </div>
            </form>
          </>
        ): viewIndex === 4 ? <>
          <HotelInvoice client={current}/>
        </> : <div style={{maxHeight: "80vh", overflowY: "scroll"}}>
        <p className="text-center">Historique</p>
        <form onSubmit={updateClientData} className="form-modal">
          <textarea
            className="form-control m-2"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <textarea
            className="form-control m-2"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Montant payé"
            required
          />
          <div className="center-x mt-4">
            <StyledButton
              type="submit"
              onClick={UpdatePayment}
              text="Modifier"
            />
          </div>
        </form>
        <div>
          <div>
            <h4 style={{textAlign: 'center'}}>Historique</h4>
          </div>
          <div>
          {current?.history?.map((hstr, index) => {
            console.log(Object.keys(hstr));
            return <div style={{margin: "10px", border: "1px solid black", padding: "10px", borderRadius: "15px"}} key={`${index}client-history`}>
              <div>
                {Object.keys(hstr).map((itm, idx) => {
                  // console.log(itm);
                  return <p key={idx}><b>{itm}: </b>{hstr[itm].constructor === Array ? "list": hstr[itm]}</p>
                })}
              </div>
            </div>
          })}
          </div>
        </div>
      </div>}
      </CustomModal>
    </>
  );
}

export default ClientsPanel;
