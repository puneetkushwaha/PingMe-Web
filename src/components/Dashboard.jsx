import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Users, CircleDashed, Settings, Search, EllipsisVertical, LogOut, Check, CheckCheck, Paperclip, Smile, Mic, Send, Image as ImageIcon, Video, Phone, X, Shield, Star, Archive, MessageSquarePlus } from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
    const { users, getUsers, selectedUser, setSelectedUser, messages, sendMessage, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    const { authUser, logout, onlineUsers } = useAuthStore();
    const [messageInput, setMessageInput] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [filter, setFilter] = useState("all");
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [subscribeToMessages, unsubscribeFromMessages]);

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedUser) return;
        sendMessage({ text: messageInput });
        setMessageInput("");
    };

    const handleLogout = async () => {
        setShowMenu(false);
        await logout();
    };

    return (
        <div className="flex h-screen w-full bg-wa-dark overflow-hidden">
            {/* 1. Far Left Navbar (LeftNav style) */}
            <div className="w-[60px] h-full bg-wa-sidebar flex flex-col justify-between items-center py-4 border-r border-white/5 z-20 shrink-0">
                <div className="flex flex-col gap-6">
                    <div className="relative cursor-pointer">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-wa-teal rounded-r-full"></div>
                        <MessageSquare className="size-6 text-wa-white" />
                    </div>
                    <Phone className="size-6 text-wa-gray hover:text-wa-white transition-colors cursor-pointer" />
                    <CircleDashed className="size-6 text-wa-gray hover:text-wa-white transition-colors cursor-pointer" />
                    <Star className="size-6 text-wa-gray hover:text-wa-white transition-colors cursor-pointer" />
                </div>

                <div className="flex flex-col gap-6 items-center">
                    <div className="h-[1px] w-8 bg-white/10"></div>
                    <div className="relative group">
                        <Settings
                            className="size-6 text-wa-gray hover:text-wa-white transition-colors cursor-pointer"
                            onClick={() => setShowMenu(!showMenu)}
                        />
                        {showMenu && (
                            <div className="absolute left-10 bottom-0 w-48 bg-wa-dropdown rounded-lg shadow-2xl border border-white/5 z-50 overflow-hidden animate-in">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-sm text-wa-white hover:bg-white/5 flex items-center gap-3"
                                >
                                    <LogOut className="size-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                    <img src={authUser?.profilePic || "/avatar.png"} className="size-8 rounded-full object-cover ring-1" alt="Profile" />
                </div>
            </div>

            {/* 2. Sidebar Area */}
            <div className="w-[400px] h-full border-r border-white/5 flex flex-col bg-wa-sidebar shrink-0">
                <div className="h-16 px-4 flex items-center justify-between shrink-0">
                    <h1 className="text-wa-title">Chats</h1>
                    <div className="flex items-center gap-4 text-wa-gray">
                        <MessageSquarePlus className="size-5 cursor-pointer hover:text-wa-white" />
                        <EllipsisVertical className="size-5 cursor-pointer hover:text-wa-white" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-3 py-2">
                    <div className="search-container">
                        <Search className="size-3.5 text-wa-gray" />
                        <input
                            type="text"
                            placeholder="Search or start new chat"
                            className="bg-transparent border-none outline-none text-wa-white text-sm w-full placeholder-wa-gray px-2"
                        />
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="px-3 pb-2 flex gap-2">
                    {["All", "Unread", "Groups"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f.toLowerCase())}
                            className={`filter-chip ${filter === f.toLowerCase() ? "active" : ""}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`w-full p-3 flex items-center gap-3 transition-all cursor-pointer border-b border-white/5
                                ${selectedUser?._id === user._id ? "chat-item-active" : "hover-bg-header"}`}
                        >
                            <div className="relative shrink-0">
                                <img src={user.profilePic || "/avatar.png"} className="size-11 rounded-full object-cover" alt="" />
                                {onlineUsers.includes(user._id) && (
                                    <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 ring-2 rounded-full" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h3 className="font-bold truncate text-[15px] text-wa-white">
                                        {user.fullName}
                                    </h3>
                                    <span className="text-[10px] text-wa-gray">11:23 PM</span>
                                </div>
                                <div className="text-[12px] truncate text-wa-gray">
                                    {user.lastMessage || "No messages yet"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Main Content Area */}
            <div className="flex-1 h-full relative bg-wa-main">
                {selectedUser ? (
                    <div className="flex flex-col h-full">
                        {/* Chat Header */}
                        <div className="h-16 px-4 bg-wa-header flex items-center justify-between shrink-0 border-b border-white/5">
                            <div className="flex items-center gap-3 cursor-pointer">
                                <img src={selectedUser.profilePic || "/avatar.png"} className="size-10 rounded-full object-cover" alt="" />
                                <div>
                                    <h3 className="text-wa-white font-medium leading-none mb-1">{selectedUser.fullName}</h3>
                                    <p className="text-xs text-wa-gray">{onlineUsers.includes(selectedUser._id) ? "online" : "offline"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-wa-gray-light">
                                <Video className="size-5 cursor-pointer hover:text-wa-white" />
                                <Phone className="size-5 cursor-pointer hover:text-wa-white" />
                                <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
                                <Search className="size-5 cursor-pointer hover:text-wa-white" />
                                <EllipsisVertical className="size-5 cursor-pointer hover:text-wa-white" />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 bg-chat-dark bg-chat-pattern space-y-2 custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg._id} className={`flex ${msg.senderId === authUser._id ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[65%] px-3 py-1.5 rounded-lg relative text-[14.2px] shadow-sm ${msg.senderId === authUser._id ? "bg-[#005c4b] text-wa-white rounded-tr-none" : "bg-wa-header text-wa-white rounded-tl-none"}`}>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                                            <span className="text-[10px]">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {msg.senderId === authUser._id && (
                                                <CheckCheck className={`size-3 ${msg.status === 'seen' ? "text-[#53bdeb]" : ""}`} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="min-h-[62px] px-4 py-2 bg-wa-header flex items-center gap-2 border-t border-white/5">
                            <div className="flex gap-4 p-2 text-wa-gray-light">
                                <Smile className="size-6 cursor-pointer hover:text-wa-white" />
                                <Paperclip className="size-6 cursor-pointer hover:text-wa-white" />
                            </div>
                            <div className="flex-1 bg-wa-input rounded-lg px-4 py-2.5">
                                <input
                                    type="text"
                                    placeholder="Type a message"
                                    className="bg-transparent border-none outline-none text-wa-white text-sm w-full placeholder-wa-gray"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                />
                            </div>
                            {messageInput.trim() ? (
                                <button onClick={handleSendMessage} className="p-2 text-wa-teal"><Send className="size-6" /></button>
                            ) : (
                                <div className="p-2 text-wa-gray-light"><Mic className="size-6 cursor-pointer hover:text-wa-white" /></div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-16 bg-wa-main border-l border-wa-sidebar">
                        <div className="max-w-md text-center space-y-6">
                            <div className="flex justify-center gap-4 mb-4">
                                <MessageSquare className="size-24 text-wa-gray-dark opacity-50" />
                            </div>
                            <h2 className="text-3xl font-light text-wa-white mt-10">PingMe Web</h2>
                            <p className="text-wa-gray text-sm mt-4 leading-6">
                                Send and receive messages without keeping your phone online.<br />
                                Use PingMe on up to 4 linked devices and 1 phone.
                            </p>
                            <div className="mt-12 flex items-center justify-center gap-2 text-wa-gray-light text-xs absolute bottom-10">
                                <Shield className="size-3" /> End-to-end encrypted
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
