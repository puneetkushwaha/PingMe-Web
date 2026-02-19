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
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    pairingCode: null,
    isPairing: false,

    // ✅ Update user profile
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error in updateProfile:", error?.response?.data?.message || error.message);
            toast.error(error?.response?.data?.message || "Profile update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    // UI State
    activeSidebar: "chats",
    isProfileOpen: false,
    setActiveSidebar: (view) => set({ activeSidebar: view, isProfileOpen: false }),
    setProfileOpen: (isOpen) => set({ isProfileOpen: isOpen }),

    checkAuth: async () => {
        try {
            const deviceId = localStorage.getItem("pingme_device_id");
            // Send deviceId to update lastActiveAt
            const res = await axiosInstance.get(`/auth/check?deviceId=${deviceId || ""}`);
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error);
            // If device is unlinked (401), ensure we logout/clear state
            if (error.response && error.response.status === 401) {
                set({ authUser: null });
                if (get().socket) get().socket.disconnect();
            } else {
                set({ authUser: null });
            }
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

        // Listen for remote unlinking
        newSocket.on("device:unlinked", ({ deviceId }) => {
            const myDeviceId = localStorage.getItem("pingme_device_id");
            if (deviceId === myDeviceId) {
                get().logout();
                toast.error("This device has been unlinked.");
            }
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
