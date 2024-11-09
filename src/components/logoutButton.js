import React from 'react';
import { useAuth } from '../auth/authContextProvider';

const LogoutButton = () => {
    const { logout } = useAuth();

    return <button onClick={logout}>Logout</button>;
};

export default LogoutButton;