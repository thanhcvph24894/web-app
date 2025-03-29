import {request, authRequest} from './api-client';

export interface AuthData {
  id: string;
  name: string;
  email: string;
  phone: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

const authService = {
  login: (data: LoginRequest) => {
    return request<AuthData>('auth/login', 'POST', data);
  },

  register: (data: RegisterRequest) => {
    return request<AuthData>('auth/register', 'POST', data);
  },

  getProfile: () => {
    return authRequest<AuthData>('auth/me');
  },

  updateProfile: (data: UpdateProfileRequest) => {
    return authRequest<AuthData>('auth/me', 'PUT', data);
  },

  changePassword: (data: ChangePasswordRequest) => {
    return authRequest('auth/change-password', 'PUT', data);
  },
};

export default authService;
