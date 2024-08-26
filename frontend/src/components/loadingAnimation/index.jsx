import React, { useState } from 'react';
import "./style.css"
import Lottie from 'react-lottie';
import Animation1 from '../../assets/restaurant_load.json';
import Animation2 from '../../assets/load2.json'

function LoadingAnimation({isIntro=false}) {

    const [animations, setAnimations] = useState([
        Animation2
    ]);

    return (
        <div>
            <div className='lottiebackground' style={{backgroundColor: isIntro ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.3)"}} >
            <Lottie
                width={isIntro ? "40%" : "30%"}
                height={isIntro ? "40%" : "30%"}
                options={{
                autoplay: true,
                loop: true,
                animationData: isIntro ? Animation2 : animations[Math.floor(Math.random() * animations.length)]
                }}
            />
        </div>
        </div>
    )
}

export default LoadingAnimation
