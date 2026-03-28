import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navigation = () => {
    const [value, setValue] = React.useState(0);

    return (
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} />
            <BottomNavigationAction label="Search" icon={<SearchIcon />} />
            <BottomNavigationAction label="Add" icon={<AddIcon />} />
            <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
        </BottomNavigation>
    );
};

export default Navigation;