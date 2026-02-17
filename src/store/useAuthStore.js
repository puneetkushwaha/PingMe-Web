import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Environment-based base URL
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://pingme-backend-fxtc.onrender.com";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isLoggingIn: false,
    onlineUsers: [],
    socket: null,
    pairingCode: null,
    isPairing: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    connectSocket: (isPairing = false) => {
        const { authUser, socket } = get();
        if (!isPairing && (!authUser || socket?.connected)) return;
        if (isPairing && socket?.connected) return;

        const newSocket = io(BASE_URL, {
            query: {
                userId: authUser?._id || "",
                isPairing: isPairing ? "true" : "false"
            },
        });

        newSocket.connect();
        set({ socket: newSocket });

        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        newSocket.on("pairing:code", ({ pairingCode }) => {
            set({ pairingCode });
        });

        newSocket.on("pairing:authorized", async ({ pairingToken }) => {
            await get().loginWithPairingToken(pairingToken);
        });
    },

    initiatePairing: () => {
        get().connectSocket(true);
        set({ isPairing: true });
    },

    loginWithPairingToken: async (pairingToken) => {
        try {
            // Generate or get deviceId from localStorage
            let deviceId = localStorage.getItem("pingme_device_id");
            if (!deviceId) {
                deviceId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
                localStorage.setItem("pingme_device_id", deviceId);
            }

            // Detect device name (simple)
            const userAgent = navigator.userAgent;
            let deviceName = "Unknown Device";
            if (userAgent.includes("Windows")) deviceName = "Chrome on Windows";
            else if (userAgent.includes("Mac")) deviceName = "Chrome on Mac";
            else if (userAgent.includes("Linux")) deviceName = "Chrome on Linux";
            else if (userAgent.includes("Android")) deviceName = "Chrome on Android";
            else if (userAgent.includes("iPhone")) deviceName = "Chrome on iPhone";

            const res = await axiosInstance.post("/auth/login-with-token", {
                pairingToken,
                deviceInfo: {
                    deviceId,
                    deviceName,
                    userAgent
                }
            });
            set({ authUser: res.data });
            set({ pairingCode: null, isPairing: false });
            get().connectSocket();
            toast.success("Logged in via QR Code!");
        } catch (error) {
            toast.error("Pairing failed");
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            if (get().socket) get().socket.disconnect();
            toast.success("Logged out");
        } catch (error) {
            toast.error("Logout failed");
        }
    },
}));
