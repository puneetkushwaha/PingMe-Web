import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
// import SidebarSkeleton from "./skeletons/SidebarSkeleton"; // Commented out until skeleton is created
import { Users, CircleDashed, MessageSquarePlus, EllipsisVertical, Search, Filter, Archive, LogOut, UserPlus, Settings, Download, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ activeSidebar, setActiveSidebar }) => {
    const { getUsers, users, getGroups, groups, selectedUser, setSelectedUser, isUsersLoading, unreadCounts, typingUsers } = useChatStore();
    const { onlineUsers, logout, authUser } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'unread', 'groups'

    // Modals (Simplified: Alert for now or create later)
    const isGroupModalOpen = false;

    useEffect(() => {
        getUsers();
        getGroups();
    }, [getUsers, getGroups]);


    const allItems = activeFilter === "groups" ? groups : users;

    const filteredItems = allItems.filter((item) => {
        const itemName = item.fullName || item.name || "";
        const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase());
        // Only show item if it has a last message or is a group (groups always show for now in this logic, can be refined)
        // In pingme-link, we might just want to show all users returned by backend who have chats.
        // The backend /messages/users usually returns users with chat history or all users? 
        // Let's assume consistent behavior with frontend.
        const hasHistory = item.lastMessage || item.isGroup;

        if (activeFilter === "unread") return matchesSearch && unreadCounts[item._id] > 0 && hasHistory;
        if (activeFilter === "groups") return matchesSearch;

        // For 'all', show items with history or just all users for now to be safe
        return matchesSearch;
    });

    if (isUsersLoading) return <div className="flex-1 flex items-center justify-center text-white/50">Loading chats...</div>;

    return (
        <aside className="h-full w-full lg:w-[400px] border-r border-[#2f3b43] flex flex-col bg-[#111b21] transition-all duration-200">

            {/* Minimalist Sidebar Header */}
            <div className="h-16 px-4 flex items-center justify-between shrink-0 sticky top-0 z-20 bg-[#202c33]">
                <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
                    <img src={authUser?.profilePic || "/avatar.png"} alt="Profile" className="w-full h-full object-cover" />
                </div>

                <div className="flex items-center gap-4 text-[#aebac1]">
                    <CircleDashed className="size-6 cursor-pointer hover:text-white transition-colors" />
                    <MessageSquarePlus className="size-6 cursor-pointer hover:text-white transition-colors" />

                    <div className="relative group">
                        <EllipsisVertical className="size-6 cursor-pointer hover:text-white transition-colors" />
                        <div className="absolute right-0 top-10 w-48 bg-[#233138] rounded-lg shadow-xl border border-[#2f3b43] hidden group-hover:block z-50 overflow-hidden py-2">
                            <div className="flex flex-col">
                                <button
                                    onClick={() => toast("New group not supported on web yet")}
                                    className="w-full text-left px-4 py-3 text-sm text-[#d1d7db] hover:bg-[#111b21] flex items-center gap-3"
                                >
                                    <UserPlus className="size-4" />
                                    New group
                                </button>
                                <button
                                    onClick={() => toast("Settings not supported on web yet")}
                                    className="w-full text-left px-4 py-3 text-sm text-[#d1d7db] hover:bg-[#111b21] flex items-center gap-3"
                                >
                                    <Settings className="size-4" />
                                    Settings
                                </button>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-3 text-sm text-[#d1d7db] hover:bg-[#111b21] flex items-center gap-3 border-t border-[#2f3b43]"
                                >
                                    <LogOut className="size-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-3 py-2 bg-[#111b21] border-b border-[#2f3b43]">
                <div className="flex items-center gap-2 bg-[#202c33] rounded-lg px-3 py-1.5 h-[35px] group transition-all">
                    <Search className="size-4 text-[#aebac1] group-focus-within:text-[#00a884] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        className="bg-transparent border-none outline-none text-[#d1d7db] text-sm w-full placeholder-[#aebac1]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Pills */}
            <div className="px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-[#111b21]">
                {["All", "Unread", "Groups"].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter.toLowerCase())}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all
              ${activeFilter === filter.toLowerCase()
                                ? "bg-[#00a884] text-[#111b21]"
                                : "bg-[#202c33] text-[#aebac1] hover:bg-[#2a3942]"}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto w-full flex-1 scrollbar-thin scrollbar-thumb-[#202c33] bg-[#111b21]">
                <AnimatePresence initial={false}>
                    {filteredItems.map((item) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            key={item._id}
                            onClick={() => setSelectedUser(item)}
                            className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-[#202c33] transition-all cursor-pointer border-b border-[#2f3b43]
                  ${selectedUser?._id === item._id ? "bg-[#2a3942]" : ""}
                `}
                        >
                            <div className="relative shrink-0">
                                <img
                                    src={item.profilePic || "/avatar.png"}
                                    alt={item.fullName || item.name}
                                    className="size-12 object-cover rounded-full"
                                />
                            </div>

                            {/* User/Group info */}
                            <div className="text-left min-w-0 flex-1 py-1">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="font-normal truncate text-[17px] text-[#e9edef]">
                                        {item.fullName || item.name}
                                    </div>
                                    <span className="text-[12px] text-[#8696a0]">
                                        {item.lastMessageTime ? new Date(item.lastMessageTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : ''}
                                    </span>
                                </div>
                                <div className="text-[14px] truncate flex items-center gap-1 text-[#8696a0]">
                                    {typingUsers.includes(item._id) ? (
                                        <span className="text-[#00a884] font-medium">typing...</span>
                                    ) : (
                                        item.lastMessage || "No messages yet"
                                    )}
                                </div>
                            </div>

                            {/* Unread Badge */}
                            <div className="flex flex-col items-end justify-center min-w-[20px] ml-2">
                                {!item.isGroup && unreadCounts[item._id] > 0 && (
                                    <span className="bg-[#00a884] text-[#111b21] text-[12px] font-bold rounded-full size-5 flex items-center justify-center">
                                        {unreadCounts[item._id]}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <div className="text-center text-[#8696a0] py-10 mt-10">
                        <p className="text-sm">No chats found</p>
                    </div>
                )}
            </div>
        </aside>
    );
};
export default Sidebar;
