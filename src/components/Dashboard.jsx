import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Users, Settings, Search, EllipsisVertical, LogOut, Paperclip, Send, Mic, Phone, Video, Image as ImageIcon, CheckCheck, Smile, Star, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function Dashboard() {
    const { users, getUsers, selectedUser, setSelectedUser, messages, sendMessage, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    const { authUser, logout, onlineUsers } = useAuthStore();
    const [messageInput, setMessageInput] = useState("");
    const [activeTab, setActiveTab] = useState("chats");
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => getUsers(), [getUsers]);

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [subscribeToMessages, unsubscribeFromMessages]);

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedUser) return;
        sendMessage({ text: messageInput });
        setMessageInput("");
    };

    return (
        <div className="flex h-screen w-full bg-black overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[150px] rounded-full"></div>
            </div>

            {/* 1. Main Navigation Rail */}
            <nav className="w-[80px] h-full glass-panel flex flex-col items-center py-8 z-20 border-r-0 border-white/5 relative">
                <div className="mb-8 p-2 bg-gradient-to-br from-[var(--accent-primary)] to-blue-500 rounded-xl shadow-lg shadow-cyan-500/20">
                    <MessageSquare className="size-6 text-black" strokeWidth={2.5} />
                </div>

                <div className="flex flex-col gap-4 w-full px-3">
                    {[{ id: 'chats', icon: MessageSquare }, { id: 'status', icon: Star }, { id: 'calls', icon: Phone }, { id: 'settings', icon: Settings }].map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        >
                            <item.icon className="size-6" />
                        </div>
                    ))}
                </div>

                <div className="mt-auto flex flex-col gap-6 items-center w-full pb-6">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 p-0.5 cursor-pointer hover:border-[var(--accent-primary)] transition-colors">
                        <img src={authUser?.profilePic || "/avatar.png"} className="w-full h-full rounded-full object-cover" alt="Profile" />
                    </div>
                    <button
                        onClick={logout}
                        className="text-white/40 hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="size-6" />
                    </button>
                </div>
            </nav>

            {/* 2. Sidebar List (Chats) */}
            <div className="w-[380px] h-full flex flex-col glass-panel border-l-0 z-10">
                <div className="p-6 pb-2">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-white">Chats</h1>
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white">
                            <MoreVertical className="size-5" />
                        </button>
                    </div>

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[var(--accent-primary)] focus:bg-white/10 transition-all placeholder:text-white/20"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 pb-2 custom-scrollbar space-y-1">
                    {users.map((user) => (
                        <motion.div
                            key={user._id}
                            whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.03)" }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => setSelectedUser(user)}
                            className={`p-3 rounded-xl flex items-center gap-4 cursor-pointer transition-all border border-transparent
                                ${selectedUser?._id === user._id ? "bg-white/10 border-white/5 shadow-lg" : "hover:bg-white/5"}`}
                        >
                            <div className="relative">
                                <img src={user.profilePic || "/avatar.png"} className="size-12 rounded-full object-cover" alt="" />
                                {onlineUsers.includes(user._id) && (
                                    <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-black rounded-full" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className={`font-semibold truncate ${selectedUser?._id === user._id ? "text-white" : "text-gray-300"}`}>
                                        {user.fullName}
                                    </h3>
                                    <span className="text-xs text-white/30">12:30 PM</span>
                                </div>
                                <div className="text-sm truncate text-white/40">
                                    {user.lastMessage || "Start a conversation"}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 3. Main Chat Area */}
            <div className="flex-1 h-full relative flex flex-col bg-black/40 backdrop-blur-sm z-10">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img src={selectedUser.profilePic || "/avatar.png"} className="size-10 rounded-full object-cover" alt="" />
                                    {onlineUsers.includes(selectedUser._id) && (
                                        <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 border-2 border-black rounded-full" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white leading-tight">{selectedUser.fullName}</h2>
                                    <p className="text-xs text-[var(--accent-primary)] font-medium">
                                        {onlineUsers.includes(selectedUser._id) ? "Online now" : "Offline"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-white/60">
                                <Phone className="size-5 hover:text-white cursor-pointer transition-colors" />
                                <Video className="size-5 hover:text-white cursor-pointer transition-colors" />
                                <Search className="size-5 hover:text-white cursor-pointer transition-colors" />
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                            {messages.map((msg) => {
                                const isMe = msg.senderId === authUser._id;
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={msg._id}
                                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[65%] px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-md
                                            ${isMe
                                                ? "bg-gradient-to-br from-[var(--accent-primary)] to-cyan-600 text-black font-medium rounded-tr-sm"
                                                : "bg-[#1f1f22] text-gray-200 border border-white/5 rounded-tl-sm"
                                            }`}
                                        >
                                            <p>{msg.text}</p>
                                            <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? "text-black/60" : "text-white/30"}`}>
                                                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {isMe && <CheckCheck className="size-3" />}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Input */}
                        <div className="p-6 pt-2 bg-gradient-to-t from-black via-black/80 to-transparent">
                            <div className="bg-[#1f1f22] border border-white/5 rounded-2xl flex items-center p-2 pr-2 gap-2 shadow-xl">
                                <div className="flex gap-1 px-2 text-white/40">
                                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors hover:text-[var(--accent-secondary)]">
                                        <Paperclip className="size-5" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/20 h-10"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                />
                                {messageInput.trim() ? (
                                    <button
                                        onClick={handleSendMessage}
                                        className="p-3 bg-[var(--accent-primary)] text-black rounded-xl hover:shadow-[0_0_15px_rgba(0,242,234,0.3)] transition-all transform active:scale-95"
                                    >
                                        <Send className="size-5 fill-current" />
                                    </button>
                                ) : (
                                    <button className="p-3 text-white/40 hover:text-white transition-colors">
                                        <Mic className="size-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50 select-none">
                        <div className="size-32 bg-gradient-to-br from-[var(--accent-primary)] to-blue-500 rounded-3xl blur-[50px] absolute opacity-20 animate-pulse"></div>
                        <div className="relative z-10 bg-white/5 p-6 rounded-3xl border border-white/5 mb-6">
                            <MessageSquare className="size-12 text-[var(--accent-primary)]" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome to PingMe Web</h2>
                        <p className="text-white/40 max-w-sm">
                            Select a chat from the sidebar to start messaging. <br />Keep your phone connected.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
