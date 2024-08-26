import React, { useState } from 'react'
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "../../styles/admin.css"
import SimpleButton from '../../components/simpleButton';
import StyledButton from '../../components/styledButton';
import { useNavigate } from 'react-router-dom';
import { useIdeal } from '../../context';

function InventoryAdmin() {
    const [seekDate, setSeekDate] = useState(new Date())
    const navigate= useNavigate();
    const {setDate} = useIdeal();

    function handleOnclick () {
        setDate(seekDate);
        navigate("/admin/report");

    }

    
    return (
        <div className='center-x' style={{display: "grid", gridTemplateColumns: "repeat(1, auto)"}}>
            <h4>Selectionner une date</h4>
            <Calendar value={seekDate} onChange={setSeekDate}/> 
            <br/>
            <StyledButton onClick={handleOnclick} text="Voir Rapport"/>
        </div>
    );
}

export default InventoryAdmin
