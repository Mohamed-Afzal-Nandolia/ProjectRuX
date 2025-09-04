import api from "./api-config";

export const authSignup = (data: any) => api.post("/auth/signup", data);
export const getUserIdByEmail = (data: { email: string }) => api.post("/auth/get-userId", data);
export const authVerifyOtp = (id: string, data: any) => api.post(`/auth/verify-otp/${id}`, data);
export const authResendOtp = (id: string, data: any) => api.post(`/auth/resend-otp/${id}`, data);
export const authLogin = (data: any) => api.post("/auth/login", data);
export const validateAuthToken = (data: any) => api.post("/auth/validate", data);
