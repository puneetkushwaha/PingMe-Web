import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import LeftNav from "./LeftNav";
import Sidebar from "./Sidebar";
import ChatContainer from "./ChatContainer";
import NoChatSelected from "./NoChatSelected";
import ContactInfoSidebar from "./ContactInfoSidebar";
import ProfileSettings from "./ProfileSettings";

const Dashboard = () => {
    const { selectedUser, isContactInfoOpen } = useChatStore();
    const { isProfileOpen } = useAuthStore();

    return (
        <div className="h-screen bg-[#0a0a0a] flex items-center justify-center p-0 lg:p-4 overflow-hidden relative">
            <div className="bg-[#111b21] w-full h-full lg:max-w-[1700px] lg:h-[95vh] rounded-none lg:rounded-2xl shadow-2xl flex overflow-hidden relative border border-white/5">

                {/* Navigation Rail */}
                <LeftNav className="hidden lg:flex" />

                <div className="flex flex-1 h-full overflow-hidden relative">
                    {/* Sidebar Area - Contains Chats, Calls, Settings, Contacts etc */}
                    <ProfileSettings />
                    <Sidebar />

                    {/* Chat Area */}
                    <main className={`flex-1 flex flex-col bg-[#0b141a] relative min-w-0 border-l border-white/5 ${selectedUser ? 'block' : 'hidden lg:flex'}`}>
                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                    </main>

                    {/* Contact Info Sidebar - Right Side */}
                    {isContactInfoOpen && selectedUser && (
                        <div className="hidden xl:block w-[400px] border-l border-white/5 bg-[#111b21]">
                            <ContactInfoSidebar />
                        </div>
                    )}

                    {/* Mobile Contact Info Drawer */}
                    {isContactInfoOpen && selectedUser && (
                        <div className="xl:hidden absolute inset-0 z-[100] bg-[#111b21]">
                            <ContactInfoSidebar />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
