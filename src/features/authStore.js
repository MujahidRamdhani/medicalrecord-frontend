import { create } from 'zustand'; 
import { persist } from 'zustand/middleware';
import axios from 'axios';
import Cookies from 'js-cookie';

// Enable credentials for axios requests
axios.defaults.withCredentials = true;

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isError: false,
      isSuccess: false,
      isLoading: false,
      message: '',

  // Login User
  loginUser: async (user) => {
    set({ isLoading: true, isError: false, message: '' });
    try {
      const response = await axios.post('http://localhost:9999/api/users/login', {
        email: user.email,
        password: user.password,
      });
  
      // Menyimpan userEmail di cookies
      Cookies.set('userEmail', user.email, { expires: 7 });
  
      set({ user: response.data.data, isSuccess: true, isLoading: false });
    } catch (error) {
      // Tangani error dengan status kode
      const statusCode = error.response?.status;
      const message =
        statusCode === 403
          ? 'Akun Anda belum memiliki Certificate Authority (CA). Hubungi administrator.'
          : error.response?.data?.msg || 'Email atau Password salah!';
  
      set({ isError: true, message, isLoading: false });
    }
  },
  

      // Get Me
      getMe: async () => {
        set({ isLoading: true, isError: false, message: '' });
        try {
          const response = await axios.get('http://localhost:9999/api/users/me');
          set({
            user: response.data,
            isSuccess: true,
            isError: false,
            isLoading: false,
            message: '',
          });
        } catch (error) {
          const message = error.response?.data?.msg || 'Something went wrong';
          set({
            isError: true,
            isSuccess: false,
            isLoading: false,
            message,
          });
        }
      },

      // Log Out
      logout: async () => {
        try {
          await axios.delete('http://localhost:9999/api/users/logout');
          
          // Clear cookies when logging out
          Cookies.remove('userEmail'); // Remove the 'userEmail' cookie

          set({
            user: null,
            isError: false,
            isSuccess: false,
            isLoading: false,
            message: '',
          });
        } catch (error) {
          const message = error.response?.data?.msg || 'Something went wrong';
          set({
            isError: true,
            isSuccess: false,
            message,
          });
        }
      },

      // Reset State
      resetState: () => {
        set({
          user: null,
          isError: false,
          isSuccess: false,
          isLoading: false,
          message: '',
        });
      },
    }),
    {
      name: 'auth-storage', // unique name for the storage key
      getStorage: () => localStorage, // use local storage
    }
  )
);

export default useAuthStore;