import React, { useState } from "react";
import StyledButton from "../../components/styledButton";
import SimpleButton from "../../components/simpleButton";
import NormalButton from "../../components/normalButton";
import { toast } from "react-toastify";
import CustomModal from "../../components/customModal";
import { useIdeal } from "../../context";
import { createRoom, deleteRoom } from "../../api/room";
import dateFormat from "dateformat";

function RoomsPanel() {
  const { setPending, rooms, setRooms, clients} = useIdeal();
  const [new_room, setNewRoom] = useState(null);
  const [current, setCurrent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewIndex, setViewIndex] = useState(0);

  function handlechangeRoom(keyword, value){
    setNewRoom({...new_room, [keyword]: value})
  }

  function closeModal() {
    setIsOpen(false);
    setCurrent(null);
    setNewRoom(null);
  }

  function openModal(i, data) {
    //console.log(data);
    setIsOpen(true);
    setViewIndex(i);
    setCurrent(data);
    if (i === 0) {
      setNewRoom(data);
    }
  }

  async function deleteRoomAsAdmin(room_id) {
    try {
      setPending(true);
      const response = await deleteRoom({ room_id });
      if (response.success) {
        setPending(false);
        toast.success(response?.message || "OK");
        setRooms(rooms.filter((item) => item._id !== room_id));
      } else {
        setPending(false);
        toast.error(response?.message || "Erreur!");
      }
    } catch (error) {
      setPending(false);
      toast.error(error?.message || "Erreur! Verifier votre connexion")
    }
  }

  async function updateRoomData(e){
    e.preventDefault();
  }

  async function addNewRoom(e) {
    e.preventDefault();
    try {
      setPending(true);
      const response = await createRoom(new_room);
      if (response.success) {
        setPending(false);
        toast.success(response?.message || "OK");
        setRooms([...rooms, response.room]);
        // console.log(response)
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

  return (
    <>
      <div>
        <div className="admin-table">
          <div className="center-x">
            <SimpleButton onClick={() => openModal(1, {})} text="Ajouter +" />
          </div>
          <div className="table-container">
            <div className="caption">Liste des chambres</div>
            <table>
              <thead>
                <tr>
                  <th>N° </th>
                  <th>ID</th>
                  <th>Nom (numero)</th>
                  <th>prix/jour</th>
                  <th>category</th>
                  <th>Status</th>
                  <th>Client</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rooms?.map((item, index) => {
                  return (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item?._id}</td>
                      <td>{item?.name}</td>
                      <td>{item?.price}</td>
                      <td>{item?.category}</td>
                      <td style={{color: item?.available ? "green" : "crimson"}}>{item?.available ? "Disponible" : "Occupé"}</td>
                      <td>{clients?.filter( clt => clt._id === item?.occupiedBy)[0]?.fullname || "~"}</td>
                      <td>{`${item?.checkIn}`.substring(0, 10)}</td>
                      <td>{`${item?.checkOut}`.substring(0, 10)}</td>
                      <td>
                        <NormalButton
                          onClick={() => deleteRoomAsAdmin(item._id)}
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
        <h4 className="text-center ideal-grill-text">MAMAN KINJA</h4>
        {viewIndex === 0 ? (
          <>
            <p className="text-center">Modifier une chambre</p>
            <form onSubmit={updateRoomData} className="form-modal">
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
            <p className="text-center">Ajouter une Chambre</p>
            <form onSubmit={addNewRoom}>
              <input
                className="form-control m-2"
                type="text"
                value={new_room?.name}
                onChange={(e) => handlechangeRoom("name", e.target.value)}
                placeholder="nom (numero de chambre)"
                required
              />
              <input
                className="form-control m-2"
                type="number"
                value={new_room?.price}
                onChange={(e) => handlechangeRoom("price", e.target.value)}
                placeholder="prix"
                required
              />
              <select className="form-control m-2" value={new_room?.category}
                onChange={(e) => handlechangeRoom("category", e.target.value)} required>
                <option value="">Selectionez une categorie</option>
                <option value="simple">SIMPLE</option>
                <option value="appartement">APPARTEMENT</option>
                <option value="double-lit">DOUBLE LIT</option>
                <option value="autres">AUTRES</option>
              </select>
              <div className="center-x mt-4">
                <StyledButton type="submit" onClick={() => {}} text="Ajouter" />
              </div>
            </form>
          </>
        )}
      </CustomModal>
    </>
  );
}

export default RoomsPanel;
