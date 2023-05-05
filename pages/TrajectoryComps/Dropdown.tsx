// Create a floating dropdown menu 

import React, { useState } from "react";
import axios from "axios";
import print from 'util/print';
import Draggable from "react-draggable";
import "react-number-picker/dist/style.css";


async function getDropDownElements() {
    try {
        const response = await axios.get("http://localhost:3333/api/getAll");
        const Data = response.data;
        const RouteIdList = Data.map((d: any) => d.RouteId);
        const uniqueRouteIdList = [...new Set(RouteIdList)];//remove duplicates
        return uniqueRouteIdList;
    }
    catch (error) {
        print(error);
    }
}

const Dropdown = (props: { onSelectedChange: (arg0: number) => void; selected: string | number | readonly string[] | undefined; }) => {
    const [DropDownOptions, setDropDownOptions] = useState<number[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.onSelectedChange(Number(e.target.value));
    };

    React.useEffect(() => {
        getDropDownElements().then((data) => setDropDownOptions(data));
    }, []);

    const nodeRef = React.useRef(null);

    return (
        // <Draggable nodeRef={nodeRef} bounds='parent'>
            <div ref={nodeRef} style={{ position: 'relative', justifyContent: 'left', marginLeft:10, zIndex: 1 }}>
                <select value={props.selected} onChange={handleChange}>
                    {DropDownOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        // </Draggable>
    );
};

export default Dropdown;

