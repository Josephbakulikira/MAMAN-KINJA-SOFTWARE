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
            <select value={waiter} onChange={(e) => setWaiter(e.target.value)} className='elegant-select'>
            <option value=""> ~ selectionner ~</option>

                <option value={userInfo?._id} >{userInfo?.name}</option>
                {
                    getWaiters(users).map((user) => {
                        return <option value={user._id} key={user._id}>{user.name}</option>
                    })
                }
            </select>
        </div>
    )
}

export default SelectWaiter
