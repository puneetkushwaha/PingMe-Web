import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://pingme-backend-fxtc.onrender.com/api",
    withCredentials: true,
});
