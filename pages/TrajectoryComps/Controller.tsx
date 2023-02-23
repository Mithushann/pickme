// Create a component called controoller

import React, { useState } from "react";
import colors from "@/util/Constants";
import Draggable from 'react-draggable';
import playBtn from '@/public/play.png';
import closeBtn from '@/public/close.png';
import Image from 'next/image'
import print from '@/util/print';
 

const Player = (props) => {
    const nodeRef = React.useRef(null);
    return (
        <Draggable nodeRef={nodeRef} bounds='parent'>
            
            <div ref={nodeRef} className="player-container">
                    <Image className='play-pause-btn' 
                    src={
                        props.play?closeBtn : playBtn
                    } 
                    alt="play" 
                    onClick={() => {
                        props.onPlayChange(!props.play)
                        }}/>


            </div>
        </Draggable>
    );
};

export default Player;
