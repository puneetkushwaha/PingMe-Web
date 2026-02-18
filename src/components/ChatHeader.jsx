import { useState } from "react";
import { ArrowLeft, Search, Phone, Video, X as XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore"; // Mocked
// import { formatLastSeen } from "../lib/utils"; // Check if utils exist or stub

// Format Last Seen Helper (Inline if utils missing)
const formatLastSeen = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatHeader = () => {
    const {
        selectedUser,
        setSelectedUser,
        typingUsers,
        clearMessages,
        searchQuery,
        setSearchQuery
    } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const { initiateCall } = useCallStore();

    const [isSearchOpen, setIsSearchOpen] = useState(false);

    if (!selectedUser) return null;

    const isTyping = selectedUser && typingUsers.includes(selectedUser._id);
    const isOnline = onlineUsers.includes(selectedUser._id);

    return (
        <div className="px-4 py-2.5 bg-[#202c33] border-b border-[#2f3b43] sticky top-0 z-30 w-full">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                    {/* Back Button (Mobile) */}
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="lg:hidden p-1 text-[#d1d7db]"
                    >
                        <ArrowLeft className="size-6" />
                    </button>

                    {/* User Info Click Area */}
                    <div className="flex items-center gap-3 cursor-pointer min-w-0 flex-1">
                        <div className="relative shrink-0">
                            <img
                                src={selectedUser.profilePic || selectedUser.groupPic || "/avatar.png"}
                                alt={selectedUser.fullName || selectedUser.name}
                                className="size-10 object-cover rounded-full"
                            />
                        </div>

                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                            <h3 className="font-normal text-[#e9edef] text-[16px] truncate leading-tight">
                                {selectedUser.fullName || selectedUser.name}
                            </h3>
                            <p className="text-[13px] text-[#8696a0] truncate leading-tight">
                                {isTyping ? (
                                    <span className="text-[#00a884]">typing...</span>
                                ) : selectedUser.isGroup ? (
                                    "click for group info"
                                ) : isOnline ? (
                                    "Online"
                                ) : (
                                    selectedUser.lastSeen ? `last seen ${formatLastSeen(selectedUser.lastSeen)}` : ""
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-4 text-[#aebac1]">
                    {isSearchOpen && (
                        <div className="flex items-center bg-[#2a3942] rounded-lg px-2 py-1 mr-2 transition-all">
                            <input
                                autoFocus
                                className="bg-transparent border-none outline-none text-[#d1d7db] text-sm w-32"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <XIcon className="size-4 cursor-pointer hover:text-white" onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} />
                        </div>
                    )}

                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} title="Search">
                        <Search className="size-6" />
                    </button>

                    <button onClick={() => initiateCall(selectedUser._id, "audio")} title="Voice Call">
                        <Phone className="size-5" />
                    </button>
                    <button onClick={() => initiateCall(selectedUser._id, "video")} title="Video Call">
                        <Video className="size-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
