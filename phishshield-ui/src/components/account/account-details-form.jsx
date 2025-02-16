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
import Grid from '@mui/material/Unstable_Grid2';
import { useAuth } from "../../hooks/use-auth.js";
import * as Yup from "yup";
import { useFormik } from "formik";
import { userService } from "../../services/index.js";
import { handleResponse } from "../../helpers/index.js";
import { FormHelperText, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const getValidationSchema = (t) =>
    Yup.object().shape({
        firstname: Yup.string().max(255).required(t('first_name') + ' ' + t('is_required')),
        lastname: Yup.string().max(255).required(t('last_name') + ' ' + t('is_required')),
    });

export function AccountDetailsForm() {
    const { getUser, userLogout } = useAuth();
    const user = getUser();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [response, setResponse] = useState();

    const formik = useFormik({
        initialValues: {
            firstname: user.firstname,
            lastname: user.lastname,
        },
        validationSchema: getValidationSchema(t),
        validateOnChange: true,
        onSubmit: async (values) => {
            try {
                const { firstname, lastname } = values;
                const response = await userService.updateUser(user._id, {
                    firstname,
                    lastname,
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
            <Card>
                <CardHeader subheader={t("subheader")} title={t("profile")} />
                <Divider />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid md={6} xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>{t("first_name")}</InputLabel>
                                <OutlinedInput
                                    value={formik.values.firstname}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.firstname) && Boolean(formik.errors.firstname)}
                                    label={t("first_name")}
                                    name="firstname"
                                />
                                {formik.touched.firstname && formik.errors.firstname && (
                                    <FormHelperText error>{formik.errors.firstname}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid md={6} xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>{t("last_name")}</InputLabel>
                                <OutlinedInput
                                    value={formik.values.lastname}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    error={Boolean(formik.touched.lastname) && Boolean(formik.errors.lastname)}
                                    label={t("last_name")}
                                    name="lastname"
                                />
                                {formik.touched.lastname && formik.errors.lastname && (
                                    <FormHelperText error>{formik.errors.lastname}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid md={6} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>{t("email_address")}</InputLabel>
                                <OutlinedInput
                                    disabled
                                    defaultValue={user.email}
                                    label={t("email_address")}
                                    name="email"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained">
                        {t("save_details")}
                    </Button>
                </CardActions>

                {response && response?.isError && (
                    <Grid item xs={12}>
                        <Alert severity="error">{response?.message || t("error_message")}</Alert>
                    </Grid>
                )}
                {response && !response?.isError && (
                    <Grid item xs={12}>
                        <Alert severity="success">{t("success_message")}</Alert>
                    </Grid>
                )}
            </Card>
        </form>
    );
}