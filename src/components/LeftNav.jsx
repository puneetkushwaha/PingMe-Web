import { MessageSquare, CircleDashed, Settings, Star, Phone, LogOut, UserPlus } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const LeftNav = ({ className }) => {
    const { logout, authUser, setProfileOpen, isProfileOpen, activeSidebar, setActiveSidebar } = useAuthStore();
    const { setSelectedUser } = useChatStore();

    const handleSidebarChange = (view) => {
        setActiveSidebar(view);
        setSelectedUser(null); // Deselect chat when switching views if desired, or keep it. WhatsApp keeps it.
        // Actually WhatsApp clears the "active" highlight but keeps the chat open if you switch to Status.
        // For simplicity, let's just switch the sidebar view.
    };

    return (
        <div className={className}>
            {/* Desktop Left Nav */}
            <div className="hidden lg:flex w-[64px] h-full bg-[#0a0a0a] flex-col justify-between items-center py-4 border-r border-white/5 z-20">
                {/* Top Icons */}
                <div className="flex flex-col gap-2 w-full items-center">
                    <div className="relative group cursor-pointer w-full flex justify-center py-1" onClick={() => handleSidebarChange("chats")}>
                        {activeSidebar === 'chats' && !isProfileOpen && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#00a884] rounded-r-full"></div>
                        )}
                        <div className={`p-2 rounded-xl transition-all ${activeSidebar === 'chats' && !isProfileOpen ? 'bg-[#1f2c33]' : 'hover:bg-[#1f2c33]'}`}>
                            <MessageSquare className={`size-6 transition-colors ${activeSidebar === 'chats' && !isProfileOpen ? 'text-[#e9edef]' : 'text-[#aebac1]'}`} strokeWidth={activeSidebar === 'chats' ? 2.5 : 2} />
                        </div>
                    </div>

                    <div className="relative group cursor-pointer w-full flex justify-center py-1" onClick={() => handleSidebarChange("calls")}>
                        {activeSidebar === 'calls' && !isProfileOpen && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#00a884] rounded-r-full"></div>
                        )}
                        <div className={`p-2 rounded-xl transition-all ${activeSidebar === 'calls' && !isProfileOpen ? 'bg-[#1f2c33]' : 'hover:bg-[#1f2c33]'}`}>
                            <Phone className={`size-6 transition-colors ${activeSidebar === 'calls' && !isProfileOpen ? 'text-[#e9edef]' : 'text-[#aebac1]'}`} strokeWidth={activeSidebar === 'calls' ? 2.5 : 2} />
                        </div>
                    </div>

                    <div className="relative group cursor-pointer w-full flex justify-center py-1" onClick={() => handleSidebarChange("status")}>
                        {activeSidebar === 'status' && !isProfileOpen && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#00a884] rounded-r-full"></div>
                        )}
                        <div className={`p-2 rounded-xl transition-all ${activeSidebar === 'status' && !isProfileOpen ? 'bg-[#1f2c33]' : 'hover:bg-[#1f2c33]'}`}>
                            <CircleDashed className={`size-6 transition-colors ${activeSidebar === 'status' && !isProfileOpen ? 'text-[#e9edef]' : 'text-[#aebac1]'}`} strokeWidth={activeSidebar === 'status' ? 2.5 : 2} />
                        </div>
                    </div>
                </div>

                {/* Bottom Icons */}
                <div className="flex flex-col gap-3 items-center w-full">
                    <div className="relative group cursor-pointer w-full flex justify-center" onClick={() => handleSidebarChange("starred")}>
                        <div className={`p-2 rounded-xl transition-all ${activeSidebar === 'starred' ? 'bg-[#1f2c33]' : 'hover:bg-[#1f2c33]'}`}>
                            <Star className={`size-6 transition-colors ${activeSidebar === 'starred' ? 'text-[#e9edef]' : 'text-[#aebac1]'}`} />
                        </div>
                    </div>

                    <div className="relative group cursor-pointer w-full flex justify-center" onClick={() => handleSidebarChange("settings")}>
                        <div className={`p-2 rounded-xl transition-all ${activeSidebar === 'settings' ? 'bg-[#1f2c33]' : 'hover:bg-[#1f2c33]'}`}>
                            <Settings className={`size-6 transition-colors ${activeSidebar === 'settings' ? 'text-[#e9edef]' : 'text-[#aebac1]'}`} />
                        </div>
                    </div>

                    <div className="relative group cursor-pointer w-full flex justify-center pt-2" onClick={() => setProfileOpen(true)} title="Profile">
                        <img src={authUser?.profilePic || "/avatar.png"} className={`size-8 rounded-full object-cover transition-opacity ${isProfileOpen ? 'ring-2 ring-[#00a884]' : 'opacity-80 hover:opacity-100'}`} alt="Profile" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftNav;
