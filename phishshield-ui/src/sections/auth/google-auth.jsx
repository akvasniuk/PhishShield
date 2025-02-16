import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Stack } from '@mui/material';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../../configs";
import { authService } from "../../services";
import { handleResponse } from "../../helpers";
import { useTranslation } from 'react-i18next';

const GoogleAuth = ({ setResponse }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const clientId = GOOGLE_CLIENT_ID;

    const { t } = useTranslation();

    const googleHandler = async (credentialResponse) => {
        try {
            const response = await authService.loginGoogle(credentialResponse);
            setResponse(handleResponse(response));
        } catch (e) {
            setResponse(handleResponse(e));
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Stack
                direction="row"
                spacing={matchDownSM ? 1 : 2}
                justifyContent="center"
                sx={{
                    '& .MuiButton-startIcon': {
                        mr: matchDownSM ? 0 : 1,
                        ml: matchDownSM ? 0 : -0.5
                    }
                }}
            >
                <GoogleLogin
                    onSuccess={googleHandler}
                    onError={() => {
                        console.log(t('googleAuth.loginFailed'));
                    }}
                    useOneTap
                />
            </Stack>
        </GoogleOAuthProvider>
    );
};

export default GoogleAuth;