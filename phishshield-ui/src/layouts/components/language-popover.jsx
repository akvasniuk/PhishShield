import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

const LANGUAGE_STORAGE_KEY = 'app-language';

// LanguagePopover Component
export function LanguagePopover({ data = [], sx, ...other }) {
    const { t } = useTranslation();
    const [openPopover, setOpenPopover] = useState(null);
    const [locale, setLocale] = useState(() => {
        return localStorage.getItem(LANGUAGE_STORAGE_KEY) || i18next.language;
    });

    useEffect(() => {
        i18next.changeLanguage(locale);
    }, [locale]);

    const currentLang = data.find((lang) => lang.value === locale);

    const handleOpenPopover = useCallback((event) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleChangeLang = useCallback(
        (newLang) => {
            setLocale(newLang);
            localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
            handleClosePopover();
        },
        [handleClosePopover]
    );

    const renderFlag = (label, icon) => (
        <Box
            component="img"
            alt={label}
            src={icon}
            sx={{
                width: 26,
                height: 20,
                borderRadius: 0.5,
                objectFit: 'cover',
            }}
        />
    );

    return (
        <>
            <IconButton
                onClick={handleOpenPopover}
                sx={{
                    width: 40,
                    height: 40,
                    ...(openPopover && { bgcolor: 'action.selected' }),
                    ...sx,
                }}
                {...other}
            >
                {renderFlag(currentLang?.label, currentLang?.icon)}
            </IconButton>


            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 160,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            [`&.${menuItemClasses.selected}`]: {
                                bgcolor: 'action.selected',
                                fontWeight: 'fontWeightSemiBold',
                            },
                        },
                    }}
                >
                    {data?.map((option) => (
                        <MenuItem
                            key={option.value}
                            selected={option.value === currentLang?.value}
                            onClick={() => handleChangeLang(option.value)}
                        >
                            {renderFlag(option.label, option.icon)}
                            {option.label}
                        </MenuItem>
                    ))}
                </MenuList>
            </Popover>
        </>
    );
}