import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { fetchToken } from '../services/api';
import { setToken, setUsername } from '../redux/Slices/authSlice';
import { jwtDecode } from 'jwt-decode';

export const useAuthToken = () => {
    const dispatch = useDispatch();

    // Use React Query's useQuery with refetchInterval of 10 minutes (600000 ms)
    const { data: token, isSuccess, isLoading } = useQuery({
        queryKey: ['authToken'],
        queryFn: fetchToken,
        staleTime: 300000,  // Data remains fresh for 5 minutes
        refetchInterval: 600000,  // Refetch every 10 minutes
        refetchOnWindowFocus: false, // Avoid refetching when window is focused
    });

    useEffect(() => {
        if (isSuccess && token) {
            dispatch(setToken(token));
            // Decode the JWT to get user information
            const decodedToken = jwtDecode(token);
            
            
            const username = decodedToken.userName; 
            console.log('Username:', username); 
            dispatch(setUsername(username));  
        }
    }, [token, isSuccess, dispatch]);
    
    // Optional: you can return isLoading to indicate if the token is still being fetched
    return { token, isLoading };
};
