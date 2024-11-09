import axios from 'axios';
import config from '../config';

axios.defaults.withCredentials = true;


const api = {
    login: () => {
        window.location.href = `${config.apiAuthUrl}/auth/google`; 
    },
    getCurrentUser: async () => {
        try {
            const response = await axios.get(`${config.apiAuthUrl}/api/current_user`);
            // console.log(response.data)
            return response.data;
        } catch (error) {
            console.error('Error fetching current user:', error);
            return null;
        }
    },
    logout: async (user) => {
        localStorage.removeItem('jwtToken');
        try {
            await axios.post(`${config.apiAuthUrl}/logout`,{user});
        } catch (error) {
            console.log(error)
            console.error('Logout error:', error);
        }
    },
};

export default api;
