import { create } from "zustand";

export const useCallStore = create((set, get) => ({
    calls: [],
    isCallsLoading: false,

    getCallHistory: async () => {
        // Mock implementation
        set({ calls: [] });
    },

    initiateCall: async (userId, type) => {
        // Mock implementation
        console.log("Mock call initiated to", userId, "type:", type);
        alert("Calls are not yet supported in the web client.");
    },

    logCall: async () => { },
}));
