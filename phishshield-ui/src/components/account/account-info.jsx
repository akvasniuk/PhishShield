import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAuth } from "../../hooks/use-auth.js";
import * as Yup from "yup";
import { useFormik } from "formik";
import { userService } from "../../services/index.js";
import { handleResponse } from "../../helpers/index.js";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Unstable_Grid2";
import Alert from "@mui/material/Alert";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

const getValidationSchema = (t) =>
    Yup.object().shape({
        avatar: Yup.mixed()
            .nullable()
            .test('fileFormat', t('account_info.only_images_allowed'), (value) => {
                if (!value) return true;
                const supportedFormats = ['jpeg', 'png', 'gif', 'jpg'];
                return supportedFormats.includes(value.name.split('.').pop());
            })
            .test('fileSize', t('account_info.file_size_limit'), (value) => {
                if (!value) return true;
                return value.size <= 1073741824; // 1GB in bytes
            }),
    });

export function AccountInfo() {
    const { t } = useTranslation();
    const { getUser, userLogout } = useAuth();
    const user = getUser();

    const [response, setResponse] = useState();
    const [selectedFile, setSelectedFile] = useState(undefined);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        event.preventDefault();
        setSelectedFile(event.target.files[0]);
    };

    const formik = useFormik({
        initialValues: {
            avatar: user.avatar,
        },
        validationSchema: getValidationSchema(t),
        validateOnChange: false,
        onSubmit: async (values) => {
            try {
                const { avatar } = values;
                const formData = new FormData();
                avatar ? formData.append("avatar", avatar) : "";
                const response = await userService.updateUserAvatar(user._id, formData);

                setResponse(response.data);
                userLogout();
                navigate("/sign-in");
            } catch (e) {
                setResponse(handleResponse(e));
            }
        },
    });

    return (
        <Card>
            <CardContent>
                <Stack spacing={2} sx={{ alignItems: 'center' }}>
                    <div>
                        <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
                    </div>
                    <Stack spacing={1} sx={{ textAlign: 'center' }}>
                        <Typography variant="h5">
                            {user.firstname + " " + user.lastname}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
            <Divider />
            <form onSubmit={formik.handleSubmit}>
                <CardActions>
                    <Button
                        component="label"
                        role={undefined}
                        fullWidth
                        variant="text"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        {t('account_info.upload_avatar')}
                        <VisuallyHiddenInput
                            type="file"
                            id={`body--coreSheet2--avatar`}
                            name="avatar"
                            onChange={(e) => {
                                handleFileChange(e);
                                const file = e.target.files[0];
                                formik.handleChange({
                                    target: {
                                        name: "avatar",
                                        value: file,
                                    },
                                });
                            }}
                        />
                    </Button>
                    {selectedFile && (
                        <p>
                            {t('account_info.selected_file')}: {selectedFile.name}
                        </p>
                    )}
                </CardActions>
                <Button fullWidth variant="contained" type="submit">
                    {t('account_info.save_avatar')}
                </Button>
                {response && response?.isError && (
                    <Grid item xs={12}>
                        <Alert severity="error">
                            {response?.message || t('account_info.error_message')}
                        </Alert>
                    </Grid>
                )}
                {response && !response?.isError && (
                    <Grid item xs={12}>
                        <Alert severity="success">
                            {response?.message || t('account_info.success_message')}
                        </Alert>
                    </Grid>
                )}
            </form>
        </Card>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});