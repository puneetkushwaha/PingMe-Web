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
    notiSound: null,

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

                    // Sound and Browser Notification Logic
                    const { authUser } = useAuthStore.getState();
                    const notificationSettings = authUser?.notificationSettings || {
                        showNotifications: true,
                        showPreviews: true,
                        notificationSound: true
                    };

                    // Sound
                    if (notificationSettings.notificationSound !== false) {
                        const selectedSoundFile = notificationSettings?.selectedSound || "notification.mp3";

                        if (!get().notiSound || get().notiSound.src.split('/').pop() !== selectedSoundFile) {
                            set({ notiSound: new Audio(`/${selectedSoundFile}`) });
                        }

                        const sound = get().notiSound;
                        sound.currentTime = 0;
                        sound.play().catch(() => { });
                    }

                    // Browser Notification
                    if (notificationSettings.showNotifications !== false && Notification.permission === "granted") {
                        const sender = get().users.find(u => u._id === newMessage.senderId);
                        const senderName = sender?.fullName || "Someone";

                        const notificationBody = notificationSettings.showPreviews !== false
                            ? (newMessage.text || "Sent a media file")
                            : "New message";

                        new Notification(`New message from ${isGroupMessage ? "Group" : senderName}`, {
                            body: notificationBody,
                            icon: "/icon-192x192.png"
                        });
                    }
                }
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) socket.off("newMessage");
    },

    statuses: [],
    isContactInfoOpen: false,
    setIsContactInfoOpen: (isOpen) => set({ isContactInfoOpen: isOpen }),
    isStatusesLoading: false,

    getStatuses: async () => {
        set({ isStatusesLoading: true });
        try {
            const res = await axiosInstance.get("/status");
            set({ statuses: res.data });
        } catch (error) {
            console.error("Error fetching statuses:", error);
        } finally {
            set({ isStatusesLoading: false });
        }
    },

    uploadStatus: async (statusData) => {
        try {
            const res = await axiosInstance.post("/status/upload", statusData);
            await get().getStatuses();
            toast.success("Status uploaded!");
        } catch (error) {
            toast.error("Failed to upload status");
        }
    },

    viewStatus: async (statusId) => {
        try {
            await axiosInstance.post(`/status/view/${statusId}`);
        } catch (error) {
            console.error("Error viewing status:", error);
        }
    },

    clearMessages: async (targetId) => {
        try {
            await axiosInstance.delete(`/messages/clear/${targetId}`);
            set({ messages: [] });
            toast.success("Chat cleared!");
        } catch (error) {
            toast.error("Failed to clear chat");
        }
    },

    blockUser: async (targetId) => {
        try {
            const res = await axiosInstance.post(`/messages/block/${targetId}`);
            const { authUser } = useAuthStore.getState();
            if (authUser) {
                useAuthStore.setState({
                    authUser: { ...authUser, blockedUsers: res.data.blockedUsers }
                });
            }
            toast.success(res.data.message);
        } catch (error) {
            toast.error("Failed to block user");
        }
    },

    reportUser: async (targetId) => {
        try {
            const res = await axiosInstance.post(`/messages/report/${targetId}`);
            toast.success(res.data.message);
        } catch (error) {
            toast.error("Failed to report user");
        }
    },

    setSelectedUser: (selectedItem) => {
        set({ selectedUser: selectedItem });
        if (selectedItem) {
            get().getMessages(selectedItem._id, selectedItem.isGroup);
            set({ isContactInfoOpen: false }); // Close info when switching users
        }
    },

    viewingStatus: null,
    setViewingStatus: (status) => set({ viewingStatus: status }),

    starredMessages: [],
    isStarredLoading: false,

    getStarredMessages: async () => {
        set({ isStarredLoading: true });
        try {
            const res = await axiosInstance.get("/messages/starred");
            set({ starredMessages: res.data });
        } catch (error) {
            console.error("Error fetching starred messages:", error);
        } finally {
            set({ isStarredLoading: false });
        }
    },

    starMessage: async (messageId) => {
        try {
            await axiosInstance.post(`/messages/star/${messageId}`);
            await get().getStarredMessages();
            toast.success("Message starred");
        } catch (error) {
            toast.error("Failed to star message");
        }
    },

    unstarMessage: async (messageId) => {
        try {
            await axiosInstance.post(`/messages/unstar/${messageId}`);
            await get().getStarredMessages();
            toast.success("Message unstarred");
        } catch (error) {
            toast.error("Failed to unstar message");
        }
    },
}));
