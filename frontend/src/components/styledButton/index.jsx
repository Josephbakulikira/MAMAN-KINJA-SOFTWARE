import React from 'react';
import "./style.css";

function StyledButton({text, onClick, type="button"}) {
    return (
        <button onClick={onClick} type={type} className='styled-button'>{text}</button>
    )
}

export default StyledButton
