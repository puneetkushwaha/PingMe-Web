import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCallStore } from "../store/useCallStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, CircleDashed, MessageSquarePlus, EllipsisVertical, Search, Filter, Archive, LogOut, UserPlus, Settings, Download, Phone, MonitorUp } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import NewGroupModal from "./NewGroupModal";
import PairDeviceModal from "./PairDeviceModal";
import ContactsSidebar from "./ContactsSidebar";
import StatusSidebar from "./StatusSidebar";
import SettingsSidebar from "./SettingsSidebar";
import StarredMessagesSidebar from "./StarredMessagesSidebar";

const Sidebar = () => {
    const { getUsers, users, getGroups, groups, selectedUser, setSelectedUser, isUsersLoading, isGroupsLoading, unreadCounts, typingUsers } = useChatStore();
    const { onlineUsers, logout, activeSidebar = "chats", setActiveSidebar, authUser } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'unread', 'groups'
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isPairModalOpen, setIsPairModalOpen] = useState(false);

    useEffect(() => {
        getUsers();
        getGroups();
    }, [getUsers, getGroups]);

    const { calls, getCallHistory, logCall, initiateCall } = useCallStore();

    useEffect(() => {
        if (activeSidebar === "calls") {
            getCallHistory();
        }
    }, [activeSidebar, getCallHistory]);

    // Sub-Sidebars logic
    if (activeSidebar === "contacts") return <ContactsSidebar />;
    if (activeSidebar === "status") return <StatusSidebar />;
    if (activeSidebar === "settings") return <SettingsSidebar />;
    if (activeSidebar === "starred") return <StarredMessagesSidebar />;

    const allItems = activeFilter === "groups" ? groups : users;

    const filteredItems = allItems.filter((item) => {
        const itemName = item.fullName || item.name || "";
        const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase());
        const hasHistory = item.lastMessage || item.isGroup;

        if (activeFilter === "unread") return matchesSearch && unreadCounts[item._id] > 0 && hasHistory;
        if (activeFilter === "groups") return matchesSearch;

        return matchesSearch && hasHistory;
    });

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-full lg:w-[400px] border-r border-white/5 flex flex-col bg-[#111b21] transition-all duration-200">

            {/* Header - Changes based on View */}
            <div className="h-16 px-4 flex items-center justify-between shrink-0 sticky top-0 z-20 bg-[#202c33]">
                <h1 className="text-[#e9edef] text-[22px] font-bold">
                    {activeSidebar === "calls" ? "Calls" : "Chats"}
                </h1>
                <div className="flex items-center gap-4 text-[var(--wa-gray)]">
                    {activeSidebar === "calls" ? (
                        <Phone
                            className="size-5 cursor-pointer hover:text-white transition-colors"
                            onClick={() => setActiveSidebar("contacts")}
                        />
                    ) : (
                        <>
                            <MessageSquarePlus
                                className="size-5 cursor-pointer hover:text-white transition-colors"
                                onClick={() => setActiveSidebar("contacts")}
                            />
                            <div className="relative group">
                                <EllipsisVertical className="size-5 cursor-pointer hover:text-white transition-colors" />
                                <div className="absolute right-0 top-10 w-48 bg-[#233138] rounded-lg shadow-2xl border border-white/5 hidden group-hover:block z-50 overflow-hidden">
                                    <div className="flex flex-col">
                                        <button
                                            onClick={() => setIsGroupModalOpen(true)}
                                            className="w-full text-left px-4 py-3 text-sm text-[#e9edef] hover:bg-white/5 flex items-center gap-3"
                                        >
                                            <Users className="size-4" />
                                            New group
                                        </button>
                                        <button
                                            onClick={() => setIsPairModalOpen(true)}
                                            className="w-full text-left px-4 py-3 text-sm text-[#e9edef] hover:bg-white/5 flex items-center gap-3"
                                        >
                                            <MonitorUp className="size-4" />
                                            Link a device
                                        </button>
                                        <button
                                            onClick={() => { setActiveSidebar("settings"); }}
                                            className="w-full text-left px-4 py-3 text-sm text-[#e9edef] hover:bg-white/5 flex items-center gap-3"
                                        >
                                            <Settings className="size-4" />
                                            Settings
                                        </button>
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-white/5 flex items-center gap-3"
                                        >
                                            <LogOut className="size-4" />
                                            Log out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-3 py-2 bg-[#111b21]">
                <div className="flex items-center gap-2 bg-[#202c33] rounded-lg px-3 py-1.5 h-[35px] border border-white/5 group transition-all">
                    <Search className="size-4 text-[var(--wa-gray)] group-focus-within:text-[var(--wa-teal)] transition-colors" />
                    <input
                        type="text"
                        placeholder={activeSidebar === "calls" ? "Search calls" : "Search or start new chat"}
                        className="bg-transparent border-none outline-none text-[#e9edef] text-sm w-full placeholder-[var(--wa-gray)]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Pills */}
            <div className="px-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                {["All", "Unread", "Groups"].map((filter) => (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        key={filter}
                        onClick={() => setActiveFilter(filter.toLowerCase())}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all
              ${activeFilter === filter.toLowerCase()
                                ? "bg-[var(--wa-teal)]/10 text-[var(--wa-teal)]"
                                : "bg-[#202c33] text-[var(--wa-gray)] hover:text-white"}`}
                    >
                        {filter}
                    </motion.button>
                ))}
            </div>

            {/* Chat/Call List */}
            <div className="overflow-y-auto w-full flex-1 scrollbar-thin scrollbar-thumb-white/10">
                {activeSidebar === "calls" ? (
                    calls.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-10 px-6">
                            <div className="bg-[#1a1a1a] p-4 rounded-full mb-4">
                                <Phone className="size-8 opacity-50" />
                            </div>
                            <p>No call history yet</p>
                            <button onClick={() => setActiveSidebar("contacts")} className="mt-4 text-[var(--wa-teal)] text-sm font-medium">Start a call</button>
                        </div>
                    ) : (
                        calls.map((call) => {
                            const withUser = call?.callerId?._id === authUser?._id ? call?.receiverId : call?.callerId;
                            const isOutgoing = call?.callerId?._id === authUser?._id;
                            if (!withUser || typeof withUser === 'string') return null;

                            return (
                                <div
                                    key={call._id}
                                    className="w-full p-3 flex items-center gap-4 hover:bg-[#202c33] transition-all cursor-pointer border-b border-white/5 group relative"
                                    onClick={() => initiateCall(withUser._id, call.type)}
                                >
                                    <div className="relative shrink-0">
                                        <img
                                            src={withUser.profilePic || "/avatar.png"}
                                            alt={withUser.fullName || "User"}
                                            className="size-12 object-cover rounded-full"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h3 className="font-medium text-[#e9edef] truncate">{withUser.fullName || "Unknown"}</h3>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[13px]">
                                            {call.status === "missed" ? (
                                                <Phone className="size-3 text-red-500" />
                                            ) : isOutgoing ? (
                                                <Phone className="size-3 text-[var(--wa-teal)] rotate-[135deg]" />
                                            ) : (
                                                <Phone className="size-3 text-[var(--wa-teal)]" />
                                            )}
                                            <span className={`${call.status === "missed" ? "text-red-500" : "text-[var(--wa-gray)]"}`}>
                                                {call.status === "missed" ? "Missed" : isOutgoing ? "Outgoing" : "Incoming"}
                                            </span>
                                            <span className="text-[var(--wa-gray)]">•</span>
                                            <span className="text-[var(--wa-gray)]">
                                                {new Date(call.startedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="p-2 text-[var(--wa-teal)] opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Phone className="size-5" />
                                    </button>
                                </div>
                            );
                        })
                    )
                ) : (
                    <>
                        <AnimatePresence initial={false}>
                            {filteredItems.map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    key={item._id}
                                    onClick={() => setSelectedUser(item)}
                                    className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-[#202c33] transition-all cursor-pointer border-b border-white/5
                  ${selectedUser?._id === item._id ? "bg-[#202c33]" : ""}
                `}
                                >
                                    <div className="relative shrink-0">
                                        <img
                                            src={item.profilePic || item.groupPic || "/avatar.png"}
                                            alt={item.fullName || item.name}
                                            className="size-12 object-cover rounded-full"
                                        />
                                        {!item.isGroup && onlineUsers.includes(item._id) && item.privacy?.lastSeen !== "nobody" && (
                                            <span
                                                className="absolute bottom-0 right-0 size-3 bg-emerald-500 
                                      ring-2 ring-[#0a0a0a] rounded-full"
                                            />
                                        )}
                                    </div>

                                    {/* User/Group info */}
                                    <div className="text-left min-w-0 flex-1 py-1">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <div className={`font-medium truncate text-[17px] ${selectedUser?._id === item._id ? "text-[var(--wa-text-primary)]" : "text-[#e9edef]"}`}>
                                                {item.fullName || item.name}
                                            </div>
                                            <span className={`text-[12px] ${unreadCounts[item._id] > 0 ? "text-[var(--wa-teal)] font-medium" : "text-[var(--wa-gray)]"}`}>
                                                {item.lastMessageTime ? new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <div className="text-[14px] truncate flex items-center gap-1 text-[var(--wa-gray)]">
                                            {typingUsers.includes(item._id) ? (
                                                <span className="text-[var(--wa-teal)] text-xs font-medium">typing...</span>
                                            ) : (
                                                <span className="truncate max-w-[200px]">{item.lastMessage || "Click to start chatting"}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Unread Badge */}
                                    {unreadCounts[item._id] > 0 && (
                                        <div className="flex flex-col items-end justify-center">
                                            <span className="bg-[var(--wa-teal)] text-[#111b21] text-[12px] font-bold rounded-full size-5 flex items-center justify-center">
                                                {unreadCounts[item._id]}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredItems.length === 0 && (
                            <div className="text-center text-zinc-500 py-10 flex flex-col items-center">
                                <div className="bg-[#202c33] p-4 rounded-full mb-4">
                                    {activeFilter === 'groups' ? <Users className="size-8 opacity-50" /> : <MessageSquarePlus className="size-8 opacity-50" />}
                                </div>
                                <p>No {activeFilter === 'groups' ? 'groups' : 'chats'} found</p>
                                <p className="text-xs mt-2 opacity-50">Click the + icon to start a new chat</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <NewGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
            <PairDeviceModal isOpen={isPairModalOpen} onClose={() => setIsPairModalOpen(false)} />
        </aside>
    );
};
export default Sidebar;
