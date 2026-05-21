import httpClient from './httpClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
  organizationId: number;
  organizationName: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await httpClient.post('/auth/login', data);
    return response.data.data;
  },

  getMe: async (): Promise<UserInfo> => {
    const response = await httpClient.get('/auth/me');
    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
