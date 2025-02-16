import { useState, useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { useNavigate } from "react-router-dom";

import * as Yup from 'yup';
import { Formik } from 'formik';

import { SITE_KEY } from "../../configs";
import { authService } from "../../services/index.js";
import { handleResponse } from "../../helpers/index.js";
import { strengthIndicator, strengthColor } from "../../utils/password-strength.js";
import Button from "@mui/material/Button";
import { FormHelperText } from "@mui/material";
import { styled } from "@mui/material/styles";
import Reaptcha from "reaptcha";
import Alert from "@mui/material/Alert";

import { useTranslation } from 'react-i18next';
import {Iconify} from "../../components/iconify/index.js";

export function SignUpView() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const captchaRef = useRef();

    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [response, setResponse] = useState("");
    const [selectedFile, setSelectedFile] = useState(undefined);
    const [isVerify, setIsVerify] = useState(false);

    const verify = () => {
        captchaRef.current.getResponse().then(() => {
            setIsVerify(true);
        });
    };

    const handleFileChange = (event) => {
        event.preventDefault();
        setSelectedFile(event.target.files[0]);
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    const handleSubmit = async (values) => {
        const { email, password, firstname, lastname, avatar } = values;

        try {
            const formData = new FormData();
            if (avatar) formData.append("avatar", avatar);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('firstname', firstname);
            formData.append('lastname', lastname);
            const responseData = await authService.register(formData);

            setResponse(handleResponse(responseData));
        } catch (e) {
            setResponse(handleResponse(e));
        }
    };

    useEffect(() => {
        let time;

        if (response && !response?.isError) {
            time = setTimeout(() => {
                navigate("/sign-in");
            }, 30000);
        }

        return () => {
            clearTimeout(time);
        };
    }, [response?.isError]);

    const renderForm = (
        <Formik
            initialValues={{
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                avatar: null,
                submit: null
            }}
            validationSchema={Yup.object().shape({
                firstname: Yup.string().max(255).required(t('signUp.validation.firstNameRequired')),
                lastname: Yup.string().max(255).required(t('signUp.validation.lastNameRequired')),
                email: Yup.string()
                    .email(t('signUp.validation.emailInvalid'))
                    .max(255)
                    .required(t('signUp.validation.emailRequired')),
                password: Yup.string()
                    .max(255)
                    .required(t('signUp.validation.passwordRequired'))
                    .test('is-strong-password', t('signUp.validation.passwordStrength'),
                        function (value) {
                            const temp = strengthIndicator(value ?? 0);
                            const passwordLevel = strengthColor(temp);
                            return passwordLevel?.label === 'Good' || passwordLevel?.label === 'Strong';
                        }),
                avatar: Yup.mixed()
                    .nullable()
                    .test('fileFormat', t('signUp.validation.avatarFileType'), value => {
                        if (!value) return true;
                        const supportedFormats = ['jpeg', 'png', 'gif', 'jpg'];
                        return supportedFormats.includes(value.name.split('.').pop());
                    })
                    .test('fileSize', t('signUp.validation.avatarFileSize'), value => {
                        if (!value) return true;
                        return value.size <= 1073741824;
                    }),
            })}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
                try {
                    await handleSubmit(values);
                } catch (err) {
                    setErrors({ submit: err.message });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" alignItems="flex-end">
                        <TextField
                            fullWidth
                            name="firstname"
                            label={t('signUp.firstName')}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.firstname}
                            error={Boolean(touched.firstname) && Boolean(errors.firstname)}
                            helperText={errors.firstname}
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            fullWidth
                            name="lastname"
                            label={t('signUp.lastName')}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.lastname}
                            error={Boolean(touched.lastname) && Boolean(errors.lastname)}
                            helperText={errors.lastname}
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            fullWidth
                            name="email"
                            label={t('signUp.email')}
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={errors.email}
                            sx={{ mb: 3 }}
                        />

                        <div style={{ margin: "15px auto 20px" }}>
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                            >
                                {t('signUp.uploadAvatar')}
                                <VisuallyHiddenInput
                                    type="file"
                                    name="avatar"
                                    onChange={(e) => {
                                        handleFileChange(e);
                                        handleChange({ target: { name: "avatar", value: e.target.files[0] } });
                                    }}
                                />
                            </Button>
                            {selectedFile && <p>{t('signUp.selectedFile')}: {selectedFile.name}</p>}
                        </div>

                        <TextField
                            fullWidth
                            name="password"
                            label={t('signUp.password')}
                            InputLabelProps={{ shrink: true }}
                            type={showPassword ? "text" : "password"}
                            onChange={(e) => {
                                handleChange(e);
                                changePassword(e.target.value);
                            }}
                            onBlur={handleBlur}
                            value={values.password}
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Typography variant="subtitle1" fontSize="0.75rem">
                                            {t('signUp.passwordStrength')}: {level?.label}
                                        </Typography>
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />

                        {errors.submit && (
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        )}

                        <Reaptcha ref={captchaRef} sitekey={SITE_KEY} onVerify={verify} />

                        <Button
                            fullWidth
                            type="submit"
                            color="inherit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{ mt: 3 }}
                        >
                            {t('signUp.submitButton')}
                        </Button>
                    </Box>

                    {response && response.isError && (
                        <Alert severity="error">{response.message || response}</Alert>
                    )}

                    {response && !response.isError && (
                        <>
                            <Alert severity="success">{response.message}</Alert>
                            <Alert severity="success">{t('signUp.successMessageRedirect')}</Alert>
                        </>
                    )}
                </form>
            )}
        </Formik>
    );

    return (
        <>
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
                <Typography variant="h5">{t('signUp.title')}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('signUp.alreadyHaveAccount')}{" "}
                    <Link component="button" onClick={() => navigate("/sign-in")}>
                        {t('signUp.signIn')}
                    </Link>
                </Typography>
            </Box>
            {renderForm}
        </>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
});