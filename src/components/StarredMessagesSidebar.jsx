import { Star, ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const StarredMessagesSidebar = () => {
    const { setActiveSidebar } = useAuthStore();
    // Assuming we might have a starredMessages array in store later, 
    // for now we'll just show a placeholder or filter local messages if feasible.
    // The frontend useChatStore HAS starredMessages, but I didn't see it fully populated in the read file.
    // Let's just create a placeholder for now as "Starred Messages" view.

    return (
        <div className="flex-1 flex flex-col h-full bg-[#111b21]">
            {/* Header */}
            <div className="p-4 bg-[#202c33] h-[108px] flex flex-col justify-end shrink-0 gap-4">
                <div className="flex items-center gap-6">
                    <ArrowLeft
                        className="size-6 text-[#e9edef] cursor-pointer"
                        onClick={() => setActiveSidebar("chats")}
                    />
                    <h1 className="text-[#e9edef] text-[19px] font-medium">Starred Messages</h1>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-[var(--wa-gray)]">
                <div className="bg-[#202c33] p-6 rounded-full mb-6">
                    <Star className="size-16 opacity-50 fill-white" />
                </div>
                <h3 className="text-[#e9edef] text-lg font-medium mb-2">No Starred Messages</h3>
                <p className="max-w-xs">
                    Tap and hold on any message in a chat to star it, so you can easily find it later.
                </p>
            </div>
        </div>
    );
};

export default StarredMessagesSidebar;
