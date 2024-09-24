import React, { useState } from 'react';
import "./style.css";
import FoodImage from '../../assets/default/nourriture.png';
import DrinkImage from '../../assets/default/boisson.png';
import SimpleButton from '../simpleButton';
import { toast } from 'react-toastify';

function ItemCard({item, addToCart}) {
    const [quantity, setQuantity] = useState(1);

    const Increment = () => {
        setQuantity(quantity+1);
    }

    const Decrement = () => {
        if(quantity === 1){
            toast.warn("la quantité n'est pas etre inferieur a 1")
        }else{
            setQuantity( quantity - 1);
        }
    }
    
    return (
        <div className="item-card">
            <div className="item-card-image" style={{backgroundImage: `url(${
                item.image ? item.image : item.type === "nourriture" ? FoodImage : DrinkImage
            })`}}>
                {/* <img src={item.image ? item.image : item.type === "nourriture" ? FoodImage : DrinkImage} alt="item image"/> */}
            </div>
            <div className="item-category"> {item?.name}</div>
            <hr/>
            <div className="item-heading p-1 m-0"> 
                <div className="item-author">prix: <span className="item-name" style={{fontWeight: "bold"}}>{item?.price}</span> $</div>
            </div>
            <div className='quantity-container'>
                <button className="btn btn-primary" onClick={Decrement}> - </button>
                <div style={{display: "flex", justifyContent: 'center'}}>
                <input value={quantity} style={{width: "60px", height: "40px", textAlign: "center"}} onChange={(e) => setQuantity(e.target.value)}/>
            </div>
                <button className="btn btn-primary" onClick={Increment}> + </button>
            </div>
            
            <div className='center-x'>
                <SimpleButton onClick={() => addToCart(item, quantity)} text={"Ajouter"} fontSize="20px" />
            </div>
        </div>
    )
}

export default ItemCard
