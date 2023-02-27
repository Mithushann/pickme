// Create a button with a dropdown menu that changes the visualization depending on the usertype

// Path: pages\components\CustomizedMenuButton.tsx

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import colors from "@/util/Constants";

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export default function UserTypeButton(props) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        userType: string,
    ) => {
        props.onUserChange(userType);
        setAnchorEl(null);
    };


    return (
        
        <div style={{ position: "absolute", marginRight:50 , zIndex:1, width:50, height:50}}>
            <IconButton onClick={handleClick}>
                <AccountCircleIcon
                style={{ color: colors.PrimaryColorTrygg }}
                />
            </IconButton>


            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'customized-button',
                }}
            >
                <MenuItem
                    onClick={(event) => handleMenuItemClick(event, "employee")}
                    disableRipple
                >
                    Employee
                </MenuItem>

                <MenuItem
                    onClick={(event) => handleMenuItemClick(event, "customer")}
                    disableRipple
                >
                    Customer
                </MenuItem>

            </StyledMenu>
        </div>
    );
  
}
