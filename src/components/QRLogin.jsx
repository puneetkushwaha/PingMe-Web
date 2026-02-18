import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { QRCode } from "react-qrcode-logo";
import { Monitor, Smartphone, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function QRLogin() {
    const { initiatePairing, pairingCode } = useAuthStore();

    useEffect(() => {
        initiatePairing();
        const interval = setInterval(initiatePairing, 60000);
        return () => clearInterval(interval);
    }, [initiatePairing]);

    return (
        <div className="h-screen w-full flex items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-float"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/20 blur-[120px] rounded-full animate-float" style={{ animationDelay: "2s" }}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card w-full max-w-4xl h-[600px] flex overflow-hidden shadow-2xl z-10 mx-4"
            >
                {/* Left Side: Brand & Instructions */}
                <div className="flex-1 p-12 flex flex-col justify-between border-r border-white/5 bg-black/20">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <Zap className="text-black size-6" strokeWidth={2.5} />
                            </div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                PingMe Link
                            </h1>
                        </div>
                        <p className="text-[var(--text-secondary)] mt-2 text-lg font-light">
                            Seamlessly sync your conversations across devices.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {[
                            { step: 1, text: "Open PingMe on your phone" },
                            { step: 2, text: "Go to Settings > Connected Devices" },
                            { step: 3, text: "Tap 'Link a Device' and scan code" }
                        ].map((item) => (
                            <div key={item.step} className="flex items-center gap-4 group">
                                <div className="size-8 rounded-full border border-white/10 flex items-center justify-center text-[var(--accent-primary)] font-bold bg-white/5 group-hover:bg-[var(--accent-primary)] group-hover:text-black transition-all duration-300">
                                    {item.step}
                                </div>
                                <p className="text-gray-300 group-hover:text-white transition-colors">{item.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5">
                        <Shield className="size-3 text-[var(--accent-primary)]" />
                        <span>End-to-End Encrypted Session</span>
                    </div>
                </div>

                {/* Right Side: QR Code */}
                <div className="w-[400px] bg-black/40 flex flex-col items-center justify-center relative p-12">
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-[var(--accent-primary)] blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

                        <div className="relative bg-white p-4 rounded-2xl shadow-2xl overflow-hidden">
                            {pairingCode ? (
                                <>
                                    <QRCode
                                        value={pairingCode}
                                        size={220}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        qrStyle="dots"
                                        eyeRadius={8}
                                        fgColor="#000000"
                                    />
                                    {/* Scanning Animation */}
                                    <div className="animate-scan"></div>
                                </>
                            ) : (
                                <div className="size-[220px] flex items-center justify-center bg-gray-100 rounded-lg">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 text-center space-y-2">
                        <div className="flex items-center justify-center gap-2 text-[var(--accent-primary)] font-medium">
                            <Monitor className="size-4" />
                            <span>Web Client</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Keep your phone connected to sync messages
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="absolute bottom-8 flex items-center gap-2 text-[var(--text-secondary)] opacity-50 text-sm">
                <Smartphone className="size-4" />
                <span>Supports iOS & Android</span>
            </div>
        </div>
    );
}
