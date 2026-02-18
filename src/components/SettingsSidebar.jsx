import { ArrowLeft, Moon, Bell, Shield, HelpCircle, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SettingsSidebar = () => {
    const { setActiveSidebar, logout, authUser } = useAuthStore();

    return (
        <div className="flex-1 flex flex-col h-full bg-[#111b21] animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 bg-[#202c33] h-[108px] flex flex-col justify-end shrink-0 gap-4">
                <div className="flex items-center gap-6">
                    <ArrowLeft
                        className="size-6 text-[#e9edef] cursor-pointer"
                        onClick={() => setActiveSidebar("chats")}
                    />
                    <h1 className="text-[#e9edef] text-[19px] font-medium">Settings</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                {/* Profile Card */}
                <div className="flex items-center gap-4 p-4 hover:bg-[#202c33] cursor-pointer transition-colors mb-2">
                    <img src={authUser?.profilePic || "/avatar.png"} className="size-20 rounded-full object-cover" alt="Profile" />
                    <div className="flex-1">
                        <h2 className="text-[#e9edef] text-xl font-medium">{authUser?.fullName}</h2>
                        <p className="text-[var(--wa-gray)] text-sm line-clamp-1">{authUser?.about || "Hey there! I am using PingMe."}</p>
                    </div>
                </div>

                {/* Settings List */}
                <div className="space-y-1">
                    <div className="flex items-center gap-4 p-4 hover:bg-[#202c33] cursor-pointer transition-colors text-[#e9edef]">
                        <Bell className="size-6 text-[var(--wa-gray)]" />
                        <div className="flex-1 border-b border-white/5 pb-4">
                            <h3 className="text-[17px]">Notifications</h3>
                            <p className="text-[var(--wa-gray)] text-sm">Message, group & call tones</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 hover:bg-[#202c33] cursor-pointer transition-colors text-[#e9edef]">
                        <Shield className="size-6 text-[var(--wa-gray)]" />
                        <div className="flex-1 border-b border-white/5 pb-4">
                            <h3 className="text-[17px]">Privacy</h3>
                            <p className="text-[var(--wa-gray)] text-sm">Block contacts, disappearing messages</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 hover:bg-[#202c33] cursor-pointer transition-colors text-[#e9edef]">
                        <Moon className="size-6 text-[var(--wa-gray)]" />
                        <div className="flex-1 border-b border-white/5 pb-4">
                            <h3 className="text-[17px]">Theme</h3>
                            <p className="text-[var(--wa-gray)] text-sm">Dark</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 hover:bg-[#202c33] cursor-pointer transition-colors text-[#e9edef]">
                        <HelpCircle className="size-6 text-[var(--wa-gray)]" />
                        <div className="flex-1 border-b border-white/5 pb-4">
                            <h3 className="text-[17px]">Help</h3>
                            <p className="text-[var(--wa-gray)] text-sm">Help center, contact us, privacy policy</p>
                        </div>
                    </div>

                    <div
                        onClick={logout}
                        className="flex items-center gap-4 p-4 hover:bg-[#202c33] cursor-pointer transition-colors text-red-500"
                    >
                        <LogOut className="size-6" />
                        <div className="flex-1 border-white/5 pb-4">
                            <h3 className="text-[17px]">Log out</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsSidebar;
