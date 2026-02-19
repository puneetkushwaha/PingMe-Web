import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X, Smile, Plus, Mic, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef(null);

    const { sendMessage, selectedUser } = useChatStore();
    const { authUser } = useAuthStore();

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            const enterIsSend = authUser?.chatSettings?.enterIsSend !== false;

            if (e.shiftKey) return;

            if (enterIsSend) {
                e.preventDefault();
                handleSendMessage();
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        setIsSending(true);
        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="p-2 bg-[#202c33] flex items-end gap-2 relative z-20">
            {/* Previews Overlay */}
            <AnimatePresence>
                {imagePreview && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 w-full p-3 bg-[#202c33] border-t border-[#2f3b43] flex gap-2 z-50"
                    >
                        <div className="relative">
                            <img src={imagePreview} alt="Preview" className="size-20 object-cover rounded-lg border border-white/10" />
                            <button
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-[#2f3b43] text-[#d1d7db] rounded-full p-1 shadow-md hover:bg-white/10"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Emoji Button */}
            <div className="pb-2">
                <button
                    className={`p-2 rounded-full hover:bg-white/5 transition-colors ${showEmojiPicker ? "text-[#00a884]" : "text-[#8696a0]"}`}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                    <Smile className="size-6" />
                </button>
            </div>

            {/* Attachment Button */}
            <div className="pb-2">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-[#8696a0] hover:bg-white/5 rounded-full transition-colors"
                >
                    <Plus className="size-6" />
                </button>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
            </div>

            {/* Text Input */}
            <form onSubmit={handleSendMessage} className="flex-1 bg-[#2a3942] rounded-lg flex items-center mb-1">
                <input
                    type="text"
                    placeholder="Type a message"
                    className="w-full bg-transparent border-none outline-none text-[#d1d7db] text-[15px] px-4 py-3 placeholder-[#8696a0]"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </form>

            {/* Send/Mic Button */}
            <div className="pb-2">
                {text.trim() || imagePreview ? (
                    <button
                        onClick={handleSendMessage}
                        disabled={isSending}
                        className="p-3 bg-[#00a884] text-[#111b21] rounded-full hover:shadow-md transition-all active:scale-95 flex items-center justify-center"
                    >
                        <Send className="size-5 pl-0.5" />
                    </button>
                ) : (
                    <button className="p-3 bg-[#202c33] text-[#8696a0] rounded-full hover:bg-[#2a3942] transition-colors">
                        <Mic className="size-6" />
                    </button>
                )}
            </div>

            {showEmojiPicker && (
                <div className="absolute bottom-16 left-2 z-50">
                    <EmojiPicker
                        theme="dark"
                        onEmojiClick={(emojiData) => {
                            setText((prev) => prev + emojiData.emoji);
                            setShowEmojiPicker(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default MessageInput;
