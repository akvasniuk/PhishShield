import { useSelector, useDispatch } from 'react-redux';
import {setUser, selectUser, clearUser} from "../store/reducers/authSlice";

export function useAuth() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const getUser = () => JSON.parse(localStorage.getItem('user'));
    const userIsAuthenticated = () => {
        const storedUser = getUser();
        return !(!storedUser);
    };

    const userLogin = user => {
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(setUser(user));
    };

    const userLogout = () => {
        localStorage.removeItem('user');
        dispatch(clearUser());
    };

    return { user, getUser, userIsAuthenticated, userLogin, userLogout };
}