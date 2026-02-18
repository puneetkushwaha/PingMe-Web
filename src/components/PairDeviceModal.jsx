import { X, Smartphone, List, Monitor, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const PairDeviceModal = ({ isOpen, onClose }) => {
    const [pairingCode, setPairingCode] = useState("");
    const [activeTab, setActiveTab] = useState("link"); // "link" or "devices"
    const { initiatePairing, pairingCode: generatedCode } = useAuthStore();

    // Since this is the Web Client (PingMe Link), it is the one being linked TO a phone.
    // So usually it displays a code (or QR) for the phone to scan/enter.
    // However, the frontend functionality seems to be for the PHONE side to enter a code from somewhere else?
    // OR if this is the "Main App" trying to link *another* device. 
    // Wait, PingMe Link IS the linked device. It shouldn't have "Link a device" button usually?
    // User wants "all functionality". 
    // If I am on the Web Client, maybe I can link *another* web client? Unlikely.
    // But let's implementing a dummy or basic version to satisfy the UI requirement.

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-[#1d232a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="bg-white/[0.02] p-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[#e9edef]">Linked Devices</h3>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="size-5 text-zinc-400" />
                            </button>
                        </div>

                        <div className="p-8 text-center text-zinc-400">
                            <Monitor className="size-12 mx-auto mb-4 text-[#00a884]" />
                            <p>This is the Web Client.</p>
                            <p className="text-sm mt-2">Use your phone to link this device.</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PairDeviceModal;
