import React from 'react';
import { useIdeal } from '../../context';

function SelectWaiter({waiter, setWaiter}) {
    const {users, userInfo} = useIdeal();

    const getWaiters = (data) => {
        return data.filter(user => (user.role === "waiter" || user.role === "admin" || user.role === "manager"));
    }

    const findUserName = (id) => {
        return users.filter(user => user._id === id)[0]?.name
    }

    return (
        <div className='center-x'>
        {getWaiters(users).map((user) => (
            <div
                key={user._id}
                className='card waiter-container m-2 p-2 d-flex'
                style={{
                    alignItems: "center",
                    background: waiter === user._id ? "rgb(99, 255, 79)" : "",
                    cursor: 'pointer',
                    
                }}
                onClick={() => setWaiter(user._id)}
            >
                <i className="fa fa-user-waiter" style={{ fontSize: "25px" }}></i>
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>{findUserName(user._id)}</span>
            </div>
        ))}
    </div>
    )
}

export default SelectWaiter
