import React from 'react'
import "./style.css"

function NormalButton({text, color, onClick , disabled=false}) {
    return (
        <button onClick={onClick} disabled={disabled} className={`btn btn-${color}`}>
            {text}
        </button>
    )
}

export default NormalButton
