import React from 'react';
import "./style.css"
import SimpleButton from '../simpleButton';

function CustomModal({children, isOpen, closeModal}) {

    return (
        <>
        {isOpen && <div className='custom-modal'>
            <div className='custom-container'>
                <div className='custom-close'>
                    <button className='btn btn-danger' onClick={closeModal}> x </button>
                </div>
                <hr/>
                <div>
                {children}
                </div>
            </div>
        </div>}
        </>
    )
}

export default CustomModal
