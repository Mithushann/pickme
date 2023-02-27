// Create a component called controoller

import React, { useState } from "react";
import colors from "@/util/Constants";
import Draggable from 'react-draggable';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import print from '@/util/print';
import Dropdown from "./Dropdown";
import MultipleSelectChip from "../components/ChipDropdown";


const Player = (props) => {
    const nodeRef = React.useRef(null);

    return (
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
            <MultipleSelectChip
                selected={props.selected}
                onSelectedChange={props.onSelectedChange}
            />
            </div>
           

              {/* <Dropdown
                        selected={props.selected}
                        onSelectedChange={props.onSelectedChange}
                    /> */}
        </Draggable>
    );
};

export default Player;

