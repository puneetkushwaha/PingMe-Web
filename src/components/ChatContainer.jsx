import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { Check, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatContainer = () => {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages, searchQuery } = useChatStore();
    const { authUser } = useAuthStore();
    const { wallpaper } = useThemeStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedUser._id, selectedUser.isGroup);
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const filteredMessages = messages.filter((message) => {
        if (!searchQuery?.trim()) return true;
        return message.text?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col bg-[#0b141a] h-full">
                <ChatHeader />
                <div className="flex-1 flex items-center justify-center text-[#8696a0]">Loading messages...</div>
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#0b141a] relative"
            style={{
                backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", // Standard WA Dark Doodle
                backgroundSize: "400px",
                backgroundRepeat: "repeat"
            }}
        >
            {/* Overlay for tint */}
            <div className="absolute inset-0 bg-[#0b141a] opacity-90 pointer-events-none"></div>

            <ChatHeader />

            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 relative z-10 scrollbar-thin scrollbar-thumb-white/10">
                <AnimatePresence initial={false}>
                    {filteredMessages.map((message) => {
                        const isSentByMe = message.senderId === authUser._id;

                        return (
                            <motion.div
                                key={message._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`flex flex-col ${isSentByMe ? "items-end" : "items-start"} mb-2`}
                            >
                                <div
                                    className={`
                                relative max-w-[85%] sm:max-w-[65%] px-2 py-1.5 rounded-lg shadow-sm text-[#e9edef] text-[14.2px] leading-[19px] break-words
                                ${isSentByMe ? "bg-[#005c4b] rounded-tr-none" : "bg-[#202c33] rounded-tl-none"}
                            `}
                                >
                                    {/* Image Attachment */}
                                    {message.image && (
                                        <img
                                            src={message.image}
                                            alt="Image"
                                            className="max-w-full rounded-lg mb-1 cursor-pointer"
                                            onClick={() => window.open(message.image, "_blank")}
                                        />
                                    )}

                                    {/* Text Content */}
                                    {message.text && (
                                        <span className="mr-0">{message.text}</span>
                                    )}

                                    {/* Timestamp checkmarks */}
                                    <div className="float-right flex items-end gap-1 ml-2 mt-1 h-3.5">
                                        <span className="text-[11px] text-[#ffffff99] leading-none">
                                            {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                        {isSentByMe && (
                                            <span className={message.status === "seen" ? "text-[#53bdeb]" : "text-[#ffffff99]"}>
                                                {message.status === "seen" ? <CheckCheck className="size-3.5" /> : <Check className="size-3.5" />}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={messageEndRef} />
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
