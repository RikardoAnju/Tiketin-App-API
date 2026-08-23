export interface AuthResponse {
  token: string;
  account: {
    id: string;
    publicId: string;
    email: string;
    phone: string;
    accountType: string;
    status: string;
    name: string | null;
  };
}

export interface RegisterResponse {
  message: string;
  account: {
    id: string;
    publicId: string;
    email: string;
    phone: string;
    status: string;
    accountType: string;
    name: string | null;
  };
  devOtp?: string;
}

export interface BasicMessageResponse {
  message: string;
}

export interface AuthPayload {
  userId: string;
  email?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
