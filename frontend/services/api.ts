import api from "./api-config";

export const authSignup = (data: any) => api.post("/auth/signup", data);
