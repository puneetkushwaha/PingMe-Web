import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatContainer from "./ChatContainer";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { MessageSquare, Lock } from "lucide-react";

export default function Dashboard() {
    const { selectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [activeSidebar, setActiveSidebar] = useState("chats");

    return (
        <div className="flex h-screen w-full bg-[#111b21] overflow-hidden text-[#e9edef]">
            {/* Sidebar (Always visible on large screens, hidden on small if chat selected) */}
            <div className={`${selectedUser ? "hidden lg:flex" : "flex"} w-full lg:w-[400px] h-full border-r border-[#2f3b43]`}>
                <Sidebar activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} />
            </div>

            {/* Chat Area (Visible if chat selected, or placeholder) */}
            <div className={`${!selectedUser ? "hidden lg:flex" : "flex"} flex-1 h-full flex-col bg-[#222e35]`}>
                {selectedUser ? (
                    <ChatContainer />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none bg-[#222e35] border-l-0">
                        <div className="relative mb-6">
                            <div className="size-64 bg-[#00a884]/5 rounded-full blur-[50px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                            <MessageSquare className="size-24 text-[#41525d] relative z-10 opacity-60" strokeWidth={1} />
                        </div>
                        <h2 className="text-[32px] font-light text-[#e9edef] mb-4">PingMe Web</h2>
                        <p className="text-[#8696a0] text-[14px] max-w-[460px] leading-6">
                            Send and receive messages without keeping your phone online. <br />
                            Use PingMe on up to 4 linked devices and 1 phone.
                        </p>
                        <div className="mt-14 flex items-center gap-2 text-[#667781] text-[13px]">
                            <Lock className="size-3" />
                            End-to-end encrypted
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
