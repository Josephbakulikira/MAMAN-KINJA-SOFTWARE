import React from 'react';
import "./style.css";
import { tables } from '../../constants/tablels';
import {MdTableRestaurant} from 'react-icons/md'

function TablesGrid({setSelectedTable, selectedTable}) {
    return (
        <div className='d-flex' style={{flexWrap: "wrap", justifyContent: 'center'}}>
            {
                tables.map((table) => {
                    return <div key={table} className='card table-container m-2 p-2 d-flex' style={{
                        alignItems: "center", 
                        background: table === selectedTable ? "#52f3ff" : "",
                        cursor: 'pointer'
                        }} onClick={() => setSelectedTable(table)}>
                        <MdTableRestaurant size={25}/>
                        <span style={{fontSize: "14px", fontWeight: "bold"}}>{table}</span>
                    </div>
                })
            }
        </div>
    )
}

export default TablesGrid
