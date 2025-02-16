import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter, usePathname } from '../../routes/hooks';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth.js';

export function AccountPopover({ data = [], sx, ...other }) {
    const { t } = useTranslation();
    const router = useRouter();

    const navigate = useNavigate();
    const { userLogout, getUser } = useAuth();
    const user = getUser();
    const userName = user
        ? `${user.firstname} ${user.lastname}`
        : t('accountPopover.placeholders.loadingUser');

    const pathname = usePathname();

    const [openPopover, setOpenPopover] = useState(null);

    const handleOpenPopover = useCallback((event) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleClickItem = useCallback(
        (path) => {
            handleClosePopover();
            router.push(path);
        },
        [handleClosePopover, router]
    );

    const handleLogout = (event) => {
        event.preventDefault();
        userLogout();
        navigate('/');
    };

    return (
        <>
            <IconButton
                onClick={handleOpenPopover}
                sx={{
                    p: '2px',
                    width: 40,
                    height: 40,
                }}
                {...other}
            >
                <Avatar src={user?.avatar} alt={userName} sx={{ width: 1, height: 1 }}>
                    {userName?.charAt(0)?.toUpperCase()}
                </Avatar>
            </IconButton>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: { width: 200 },
                    },
                }}
            >
                <Box sx={{ p: 2, pb: 1.5 }}>
                    <Typography variant="subtitle2" noWrap>
                        {userName}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {user?.email}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuList
                    disablePadding
                    sx={{
                        p: 1,
                        gap: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            color: 'text.secondary',
                            '&:hover': { color: 'text.primary' },
                            [`&.${menuItemClasses.selected}`]: {
                                color: 'text.primary',
                                bgcolor: 'action.selected',
                                fontWeight: 'fontWeightSemiBold',
                            },
                        },
                    }}
                >
                    {data.map((option) => (
                        <MenuItem
                            key={option.label}
                            selected={option.href === pathname}
                            onClick={() => handleClickItem(option.href)}
                        >
                            {option.icon}
                            {t(`accountPopover.menu.${option.label.toLowerCase()}`)}
                        </MenuItem>
                    ))}
                </MenuList>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ p: 1 }}>
                    <Button
                        fullWidth
                        color="error"
                        size="medium"
                        variant="text"
                        onClick={handleLogout}
                    >
                        {t('accountPopover.logout')}
                    </Button>
                </Box>
            </Popover>
        </>
    );
}