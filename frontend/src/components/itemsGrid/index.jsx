import React from 'react';
import "./style.css";
import ItemCard from '../itemCard';


function ItemsGrid({items=[], addToCart}) {

    return (
        <div className='items-grid' >
            {
                items?.map(item => <ItemCard addToCart={addToCart} item={item} key={item._id}/>)
            }
        </div>
    )
}

export default ItemsGrid
