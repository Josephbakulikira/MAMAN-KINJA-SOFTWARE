import React from 'react';
import {FaShoppingCart} from 'react-icons/fa';

import "./style.css"

function FloatingButton({setOpenPanel}) {
    return (
        <div onClick={() => setOpenPanel(true)} className='floating-button'>
            <FaShoppingCart size={25} color="white"/>
        </div>
    )
}

export default FloatingButton
