import api from './api';

export interface LoginResponse {
    token: string;
    refreshToken: string;
    expiration: string;
    user: {
        id: number;
        username: string;
        email: string;
        fullName: string;
        role: string;
        isActive: boolean;
    };
}

export const authService = {
    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login', { username, password });
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService;
