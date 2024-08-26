import React from 'react'
import "./style.css";

function SimpleButton({ onClick, text, fontSize="12px"}) {
    return (
        <button style={{fontSize: fontSize, display: 'flex', justifyContent: "center", alignItems: "center"}} onClick={onClick}  className='simple-button'>
            {text}
        </button>
    )
}

export default SimpleButton
