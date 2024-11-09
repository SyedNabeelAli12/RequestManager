import React from 'react';
import api from '../services/api';
import { Button } from '@mui/material';


const LoginButton = () => {
    const handleLogin = () => {
        api.login();
    };

    return (
        <Button onClick={handleLogin} variant='outlined'>Login with Google</Button>
    );
};

export default LoginButton;
