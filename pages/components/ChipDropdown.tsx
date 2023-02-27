import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import print from '@/util/print';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

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

function getStyles(option: string, selectedRoutes: readonly string[], theme: Theme) {
    return {
        fontWeight:
            selectedRoutes.indexOf(option) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function MultipleSelectChip(props) {
    const theme = useTheme();
    const [DropDownOptions, setDropDownOptions] = React.useState<number[]>([]);
    const [selectedRoutes, setSelectedRoutes] = React.useState<string[]>([]);


    getDropDownElements().then((data) => setDropDownOptions(data));

    React.useEffect(() => {
       props.onSelectedChange(selectedRoutes);
    }, [selectedRoutes]
        );



    const handleChange = (event: SelectChangeEvent<typeof selectedRoutes>) => {
        const {
            target: { value },
        } = event;
        setSelectedRoutes(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );

        // props.onSelectedChange( typeof value === 'string' ? value.split(',') : value,);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300, borderRadius:25}}>
                <InputLabel id="demo-multiple-chip-label">Route</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={selectedRoutes}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Route" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3}}>
                            {selected.map((value) => (
                                <Chip key={value} label={value}  />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {DropDownOptions.map((option) => (
                        <MenuItem
                            key={option}
                            value={option}
                            style={getStyles(String(option), selectedRoutes, theme)}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
function componentDidMount() {
    throw new Error('Function not implemented.');
}

