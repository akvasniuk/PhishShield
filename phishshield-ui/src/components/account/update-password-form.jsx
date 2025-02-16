import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import * as Yup from "yup";
import { useFormik } from "formik";
import { userService } from "../../services/index.js";
import { handleResponse } from "../../helpers/index.js";
import { useAuth } from "../../hooks/use-auth.js";
import { useNavigate } from "react-router-dom";
import { strengthColor, strengthIndicator } from "../../utils/password-strength.js";
import { FormHelperText } from "@mui/material";
import { useTranslation } from "react-i18next";

const getValidationSchema = (t) =>
    Yup.object().shape({
        password: Yup.string()
            .max(255)
            .required(t('update_password.password_required'))
            .test(
                'is-strong-password',
                t('update_password.password_stronger'),
                function (value) {
                    const temp = strengthIndicator(value ?? 0);
                    const passwordLevel = strengthColor(temp);
                    return passwordLevel?.label === 'Good' || passwordLevel?.label === 'Strong';
                }
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t('update_password.passwords_must_match'))
            .required(t('update_password.confirm_password_required')),
    });

export function UpdatePasswordForm() {
    const { t } = useTranslation();
    const { getUser, userLogout } = useAuth();
    const user = getUser();
    const navigate = useNavigate();

    const [response, setResponse] = useState();

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: getValidationSchema(t),
        validateOnChange: true,
        onSubmit: async (values) => {
            try {
                const { password } = values;
                const response = await userService.updateUser(user._id, {
                    password,
                });

                setResponse(response.data);
                userLogout();
                navigate("/sign-in");
            } catch (e) {
                setResponse(handleResponse(e));
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Card sx={{ width: '90%', marginLeft: '20px' }}>
                <CardHeader
                    subheader={t("update_password.password_subheader")}
                    title={t("update_password.password_title")}
                />
                <Divider />
                <CardContent>
                    <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
                        <FormControl fullWidth>
                            <InputLabel>{t("update_password.password_label")}</InputLabel>
                            <OutlinedInput
                                label={t("update_password.password_label")}
                                name="password"
                                type="password"
                                value={formik.values.password}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.password) && Boolean(formik.errors.password)}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <FormHelperText error>
                                    {formik.errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>{t("update_password.confirm_password_label")}</InputLabel>
                            <OutlinedInput
                                label={t("update_password.confirm_password_label")}
                                name="confirmPassword"
                                type="password"
                                value={formik.values.confirmPassword}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                error={
                                    Boolean(formik.touched.confirmPassword) &&
                                    Boolean(formik.errors.confirmPassword)
                                }
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <FormHelperText error>
                                    {formik.errors.confirmPassword}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Stack>
                </CardContent>
                <Divider />

                <CardActions sx={{ justifyContent: 'center' }}>
                    <Button variant="contained" type="submit">
                        {t("update_password.update_button")}
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
}