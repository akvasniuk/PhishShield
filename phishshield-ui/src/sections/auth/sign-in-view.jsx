import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth.js";
import { authService } from "../../services/index.js";
import { handleResponse } from "../../helpers/index.js";

import * as Yup from 'yup';
import { Formik } from 'formik';
import Grid from "@mui/material/Unstable_Grid2";
import Alert from "@mui/material/Alert";
import GoogleAuth from "./google-auth.jsx";

import { useTranslation } from 'react-i18next';

export function SignInView() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [response, setResponse] = useState("");
    const { userLogin, userLogout } = useAuth();
    const [query] = useSearchParams();

    useEffect(() => {
        if (response && !response?.isError) {
            authService.setTokens(response?.message);
            userLogin(response?.message?.user);
            navigate("/")
        }

        if (query.has('expSession')) {
            userLogout();
        }
    }, [response?.isError]);

    const handleSubmit = async (values) => {
        const { email, password } = values;

        try {
            const responseData = await authService.login({
                email, password
            });
            setResponse(handleResponse(responseData));
        } catch (e) {
            setResponse(handleResponse(e));
        }
    }

    const renderForm = (
        <Formik
            initialValues={{
                email: '',
                password: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email(t('signIn.emailValidation')).max(255).required(t('signIn.emailRequired')),
                password: Yup.string().max(255).required(t('signIn.passwordRequired'))
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    setStatus({ success: false });
                    setSubmitting(false);
                    await handleSubmit(values);
                } catch (err) {
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" alignItems="flex-end">
                        <TextField
                            fullWidth
                            name="email"
                            label={t('signIn.email')}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 3 }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            error={Boolean(touched.email) && errors.email}
                            helperText={errors.email}
                        />

                        <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
                            {t('signIn.forgotPassword')}
                        </Link>

                        <TextField
                            fullWidth
                            name="password"
                            label={t('signIn.password')}
                            InputLabelProps={{ shrink: true }}
                            type={showPassword ? 'text' : 'password'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            error={Boolean(touched.password) && errors.password}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />

                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            color="inherit"
                            variant="contained"
                        >
                            {t('signIn.signInButton')}
                        </LoadingButton>
                    </Box>

                    {response && response?.isError && (
                        <Grid item xs={12}>
                            <Alert severity="error">{t('signIn.loginFailed')}</Alert>
                        </Grid>
                    )}
                </form>
            )}
        </Formik>
    );

    return (
        <>
            <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
                <Typography variant="h5">{t('signIn.title')}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('signIn.noAccount')}
                    <Link component="button" onClick={() => navigate("/sign-up")} variant="subtitle2" sx={{ ml: 0.5 }}>
                        {t('signIn.getStarted')}
                    </Link>
                </Typography>
            </Box>

            {renderForm}

            <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
                <Typography
                    variant="overline"
                    sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
                >
                    {t('signIn.or')}
                </Typography>
            </Divider>

            <Box gap={1} display="flex" justifyContent="center">
                <Grid item xs={12}>
                    <GoogleAuth setResponse={setResponse} />
                </Grid>
            </Box>
        </>
    );
}