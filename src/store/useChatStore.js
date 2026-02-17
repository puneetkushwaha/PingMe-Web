import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    groups: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    unreadCounts: {},
    typingUsers: [],

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error("Error fetching users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getGroups: async () => {
        try {
            const res = await axiosInstance.get("/groups");
            const groupsWithFlag = res.data.map(g => ({ ...g, isGroup: true, fullName: g.name, profilePic: g.groupPic }));
            set({ groups: groupsWithFlag });
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    },

    getMessages: async (id, isGroup = false) => {
        set({ isMessagesLoading: true });
        try {
            const endpoint = isGroup ? `/groups/${id}` : `/messages/${id}`;
            const res = await axiosInstance.get(endpoint);
            set({ messages: res.data });

            if (!isGroup) {
                set((state) => ({ unreadCounts: { ...state.unreadCounts, [id]: 0 } }));
                useAuthStore.getState().socket?.emit("markMessagesAsSeen", { senderId: id });
            }
        } catch (error) {
            toast.error("Error fetching messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const endpoint = selectedUser.isGroup ? `/groups/send/${selectedUser._id}` : `/messages/send/${selectedUser._id}`;
            const res = await axiosInstance.post(endpoint, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error("Error sending message");
        }
    },

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            const { selectedUser } = get();
            const isGroupMessage = !!newMessage.groupId;
            const idToMatch = isGroupMessage ? newMessage.groupId : newMessage.senderId;

            if (selectedUser && idToMatch === selectedUser._id) {
                set({ messages: [...get().messages, newMessage] });
                if (!isGroupMessage) socket.emit("markMessagesAsSeen", { senderId: selectedUser._id });
            } else {
                if (!isGroupMessage) {
                    set((state) => ({
                        unreadCounts: { ...state.unreadCounts, [newMessage.senderId]: (state.unreadCounts[newMessage.senderId] || 0) + 1 }
                    }));
                }
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) socket.off("newMessage");
    },

    setSelectedUser: (selectedItem) => {
        set({ selectedUser: selectedItem });
        if (selectedItem) get().getMessages(selectedItem._id, selectedItem.isGroup);
    },
}));
