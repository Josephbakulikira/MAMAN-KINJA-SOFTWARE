import React, {useState} from 'react';
import dateformat from 'dateformat';
import SimpleButton from '../../components/simpleButton';
import StyledButton from '../../components/styledButton';
import { toast } from 'react-toastify';
import { updateUserRole } from '../../api/user';
import CustomModal from '../../components/customModal';

// console.log(users);
const roles = {
    user: {text: "new", color: "#fc9894", font: 'black'}, // user
    waiter: {text: "serveur", color: "#ffec81", font: 'black'},//waiter
    chef: {text: "chef", color: "#b181ff", font: 'black'}, 
    manager: {text: "gerant", color: "#81f0ff", font: 'black'}, // manager
    admin: {text: "admin", color: "#8cff81", font: 'black'},
    dev: {text: "dev", color: "#000000", font: 'white'}
}

function UsersAdmin({users, setUsers, setPending}) {
    const [choice, setChoice] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    

    function updateUsersContext (new_user){
        const users_list = users.filter((target) => target._id !== new_user._id);
        setUsers([...users_list, new_user]);
    }

    function closeModal() {
        setIsOpen(false);
        setChoice("");
        setCurrent(null)
    }

    function openModal(currentUser) {
        // console.log(currentUser);
        setIsOpen(true);
        setCurrent(currentUser);
    }

    const changeRole = async (e) => {
        e.preventDefault();
        if(choice === "")
            return toast.warn("choisissez un role d'accés pour l'utilisateur");
        try{
            setPending(true)
           const res = await updateUserRole({role: choice, id: current._id});
           if(res?.success){
                setChoice("");
                updateUsersContext(res?.user);
                toast.success("Role Accés d'utilisateur à ete modifié")
                closeModal();
                setPending(false)

           }else{
                toast.error(res.message || "Erreur! Verifier votre connexion, Serveur introuvable");
                setPending(false)
           }
        }catch(err){
            toast.error(err.message || "Erreur , Verifier votre connexion")
            setPending(false)

        }
    }
    

    return (
        <>
        <div className='admin-table '>
            <div className='table-container' >
            <div className='caption'>liste des utilisateurs</div>
            <table>
                <thead>
                <tr>
                    <th> date </th>
                    <th> Nom & PostNom</th>
                    <th> email </th>
                    <th> role </th>
                    <th> </th>
                </tr>
                </thead>
                <tbody>
                {
                    users.map((user) => {
                        return <tr key={user?._id}>
                            <td>le {dateformat(new Date(user?.createdAt), "dd/mm/yyyy")}</td>
                            <td>{user?.name}</td>
                            <td>{user?.email}</td>
                            <td style={{fontWeight: "bold", background: roles[user?.role].color, color: roles[user?.role].font}}>{ roles[user?.role].text}</td>
                            <td> <SimpleButton onClick={() => openModal(user)} text="modifier"/></td>
                        </tr>
                    })
                }
                </tbody>
                
            </table>
            </div>
        </div>
        <CustomModal isOpen={isOpen} closeModal={closeModal}>
            <h4 className='text-center'>MAMAN KINJA</h4>
            <p>
                Selectionner le nouveau role de cet utilisateur
            </p>
            <form onSubmit={changeRole}>
                <select value={choice} onChange={(e) => setChoice(e.target.value)} className='input-control elegant-select'>
                    <option value="">~ SELECTIONER ~</option>
                    <option value="user">NEW</option>
                    <option value="waiter">SERVEUR</option>
                    <option value="chef">CHEF</option>
                    <option value="manager">GERANT</option>
                    <option value="admin" className='text-danger'>ADMIN</option>
                </select>      
                
                <div className='center-x mt-4'>
                <StyledButton type="submit" onClick={()=>{}} text="Modifier" />
                </div>
            </form>
        </CustomModal>
        </>
    )
}

export default UsersAdmin
