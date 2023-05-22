// Create a component called controoller

import React, { useState } from "react";
import colors from "@/util/Constants";
import Draggable from 'react-draggable';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import print from '@/util/print';
import MultipleSelectChip from "./ChipDropdown";


const Player = (props) => {
    const nodeRef = React.useRef(null);

    return (
        <React.StrictMode>
        <Draggable nodeRef={nodeRef} bounds='parent'>
            <div ref={nodeRef} className="player-container">
                        {props.play ?
                            <CancelIcon className='play-pause-btn'
                                style={{ color: colors.PrimaryColorInnovativ }}
                                onClick={() => {
                                    props.onPlayChange(!props.play)
                                }} />
                            :
                            <PlayCircleOutlineIcon className='play-pause-btn'
                                style={{ color: colors.PrimaryColorInnovativ }}
                                onClick={() => {
                                    props.onPlayChange(!props.play)
                                }} />
                        }
            <h1>Trajectory plot</h1>
            <p>Choose one or more routes to visualize them on top of the layout of the warehouse</p>
            <MultipleSelectChip
                selected={props.selected}
                onSelectedChange={props.onSelectedChange}
            />
            </div>
            </Draggable>
        </React.StrictMode>
    );
};

export default Player;

