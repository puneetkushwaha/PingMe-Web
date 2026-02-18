import { Star, ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

const StarredMessagesSidebar = () => {
    const { setActiveSidebar } = useAuthStore();
    const { starredMessages, getStarredMessages, unstarMessage, isStarredLoading } = useChatStore();

    useEffect(() => {
        getStarredMessages();
    }, [getStarredMessages]);

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

            <div className="flex-1 overflow-y-auto p-4">
                {isStarredLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="loading loading-spinner text-[#00a884]"></div>
                    </div>
                ) : starredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-[var(--wa-gray)] mt-20">
                        <div className="bg-[#202c33] p-6 rounded-full mb-6">
                            <Star className="size-16 opacity-50 fill-white" />
                        </div>
                        <h3 className="text-[#e9edef] text-lg font-medium mb-2">No Starred Messages</h3>
                        <p className="max-w-xs">
                            Tap and hold on any message in a chat to star it, so you can easily find it later.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {starredMessages.map((msg) => (
                            <div key={msg._id} className="bg-[#202c33] p-3 rounded-lg flex gap-3 group relative hover:bg-[#2a3942] transition-colors">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-[#00a884] text-sm font-medium">
                                            {msg.senderId === useAuthStore.getState().authUser._id ? "You" : msg.senderId.fullName || "Unknown"}
                                        </h4>
                                        <span className="text-[10px] text-[var(--wa-gray)]">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-[#e9edef] text-sm line-clamp-2">
                                        {msg.text || (msg.image ? "📷 Photo" : "Message")}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        unstarMessage(msg._id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded absolute top-2 right-2 transition-all"
                                    title="Unstar"
                                >
                                    <Star className="size-4 fill-[#00a884] text-[#00a884]" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default StarredMessagesSidebar;
