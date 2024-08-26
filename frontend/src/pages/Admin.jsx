import React,{useState} from 'react';
import "../styles/admin.css"
import SimpleButton from '../components/simpleButton';
import { useNavigate } from 'react-router-dom';
import UsersAdmin from './adminpages/users';
import ItemsAdmin from './adminpages/items';
import OrdersAdmin from './adminpages/orders';
import BillsAdmin from './adminpages/bills';
import InventoryAdmin from './adminpages/inventory';
import { useIdeal } from '../context';
import StatsPanel from './adminpages/stats';
import ClientsPanel from './adminpages/clients';
import RoomsPanel from './adminpages/rooms';

function AdminPage() {
    const [tabIndex, setTabIndex] = useState(0);
    const {users, setUsers, items,setItems, bills, orders, setPending} = useIdeal();
    const navigate = useNavigate();
    return (
        <div className='admin-container'>
            <div className='admin-sidebar '>
                <ul>
                    <li className={`sidebar-tile ${tabIndex===0? "tile-active" : ""}`} onClick={(e)=>{setTabIndex(0); window.scrollY=0;}}>Utilisateurs</li>
                    <li className={`sidebar-tile ${tabIndex===1? "tile-active" : ""}`} onClick={(e)=>{setTabIndex(1); window.scrollY=0;}}>Produits</li>
                    <li className={`sidebar-tile ${tabIndex===2? "tile-active" : ""}`} onClick={(e)=>{setTabIndex(2); window.scrollY=0;}}>Commandes</li>
                    <li className={`sidebar-tile ${tabIndex===3? "tile-active" : ""}`} onClick={(e)=>{setTabIndex(3); window.scrollY=0;}}>Factures</li>
                    <li className={`sidebar-tile ${tabIndex===4? "tile-active" : ""}`} onClick={(e)=>{setTabIndex(4); window.scrollY=0;}}>Inventaires</li>
                    <li className={`sidebar-tile ${tabIndex===5? "tile-active" : ""}`} onClick={(e)=>{setTabIndex(5); window.scrollY=0;}}>Clients</li>
                    <li className={`sidebar-tile ${tabIndex===6? "tile-active" : ""}`} onClick={(e)=>{setTabIndex(6); window.scrollY=0;}}>Chambres</li>
                    <li className={`sidebar-tile ${tabIndex===7? "tile-active" : ""}`} onClick={(e)=>{setTabIndex(7); window.scrollY=0;}}>Statistiques</li>

                </ul>
            </div>
            <div className='admin-content' style={{width: "100%"}}>
                <div className='d-flex' style={{justifyContent: 'flex-end'}}>
                    <SimpleButton text=" < Retour" onClick={(e)=>navigate("/home")}/>
                </div>
                <hr/>
                <div style={{width: "100%"}}>
                    {tabIndex === 0 && <UsersAdmin setPending={setPending} setUsers={setUsers} users={users}/>}
                    {tabIndex === 1 && <ItemsAdmin setPending={setPending} setItems={setItems} items={items}/>}
                    {tabIndex === 2 && <OrdersAdmin/>}
                    {tabIndex === 3 && <BillsAdmin/>}
                    {tabIndex === 4 && <InventoryAdmin/>}
                    {tabIndex === 5 && <ClientsPanel setPending={setPending}/>}
                    {tabIndex === 6 && <RoomsPanel setPending={setPending}/>}
                    {tabIndex === 7 && <StatsPanel/>}
                </div>
            </div>
        </div>
    )
}

export default AdminPage
