import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Plus, MoreVertical, Search } from "lucide-react";

// Simplified Status Sidebar since we don't have the full implementation from frontend
const StatusSidebar = () => {
    const { statuses, getStatuses, uploadStatus, isStatusesLoading, setViewingStatus } = useChatStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        getStatuses();
        // Poll for statuses every 30 seconds
        const interval = setInterval(getStatuses, 30000);
        return () => clearInterval(interval);
    }, [getStatuses]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = reader.result;
            await uploadStatus({ type: "image", content: base64Image });
            getStatuses();
        };
    };

    const myStatus = statuses.find(s => s.user._id === authUser._id);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#111b21]">
            <div className="p-4 bg-[#202c33] h-16 flex items-center justify-between shrink-0">
                <h1 className="text-[#e9edef] text-xl font-bold">Status</h1>
                <div className="flex gap-4 text-[var(--wa-gray)]">
                    <Plus className="size-5 cursor-pointer hover:text-white" />
                    <MoreVertical className="size-5 cursor-pointer hover:text-white" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {/* My Status */}
                <div className="flex items-center gap-4 mb-6 cursor-pointer hover:bg-[#202c33] p-2 rounded-lg transition-colors" onClick={() => myStatus ? setViewingStatus(myStatus) : document.getElementById('status-upload').click()}>
                    <div className="relative">
                        <img src={authUser?.profilePic || "/avatar.png"} className={`size-10 rounded-full object-cover ${myStatus ? 'ring-2 ring-[#00a884] p-0.5' : 'opacity-80'}`} alt="My Status" />
                        {!myStatus && (
                            <div className="absolute bottom-0 right-0 bg-[#00a884] rounded-full p-0.5 border border-[#111b21]">
                                <Plus className="size-3 text-white" />
                            </div>
                        )}
                        <input type="file" id="status-upload" className="hidden" accept="image/*" onChange={handleUpload} />
                    </div>
                    <div>
                        <h3 className="text-[#e9edef] font-medium">My Status</h3>
                        <p className="text-[var(--wa-gray)] text-sm">{myStatus ? "Click to view your status" : "Click to add status update"}</p>
                    </div>
                </div>

                <div className="text-[var(--wa-gray)] font-medium text-sm mb-4 uppercase">Recent updates</div>

                {statuses.length === 0 ? (
                    <div className="text-center text-[var(--wa-gray)] text-sm py-4">
                        No recent updates
                    </div>
                ) : (
                    <div className="space-y-2">
                        {statuses.filter(s => s.user._id !== authUser._id).map((status) => (
                            <div key={status._id} className="flex items-center gap-4 p-2 hover:bg-[#202c33] rounded-lg cursor-pointer transition-colors" onClick={() => setViewingStatus(status)}>
                                <div className="ring-2 ring-[#00a884] rounded-full p-0.5">
                                    <img src={status.user?.profilePic || "/avatar.png"} className="size-10 rounded-full object-cover" alt={status.user?.fullName} />
                                </div>
                                <div>
                                    <h3 className="text-[#e9edef] font-medium">{status.user?.fullName}</h3>
                                    <p className="text-[var(--wa-gray)] text-xs">{new Date(status.statuses[status.statuses.length - 1]?.createdAt || status.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatusSidebar;
