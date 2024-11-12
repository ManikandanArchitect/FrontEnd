import axios from 'axios';

export const fetchToken = async () => {
    try {
        const response = await axios.get('http://localhost:50352/users/sso');
        // Check if the response contains the expected token
        if (response.data) {
            console.log(response.data); // Log token (remove in production)
            return response.data; // Return the JWT token
        } else {
            throw new Error('Token not found in the response');
        }
    } catch (error) {
        console.error('Error fetching token:', error); // Log error for debugging
        throw error; // Re-throw the error so it can be caught by the caller
    }
};
