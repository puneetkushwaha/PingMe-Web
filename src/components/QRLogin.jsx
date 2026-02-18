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
const { initiatePairing, pairingCode } = useAuthStore();

useEffect(() => {
    initiatePairing();
    const interval = setInterval(() => {
        initiatePairing();
    }, 60000); // 1 minute
    return () => clearInterval(interval);
}, [initiatePairing]);

return (
    <div className="min-h-screen w-full bg-wa-dark flex flex-col items-center">
        {/* Top Green Bar */}
        <div className="w-full h-56 bg-wa-teal absolute top-0 left-0 hidden md-block"></div>

        <div className="z-10 w-full max-w-1000 mt-0 md-mt-24 bg-white shadow-2xl rounded-none md-rounded-sm flex flex-col md-flex-row overflow-hidden min-h-600 animate-in">
            {/* Instructions */}
            <div className="flex-1 p-12 md-p-16 text-wa-gray-dark space-y-12 bg-wa-light md-bg-white border-b md-border-b-0 md-border-r border-zinc-100">
                <div className="space-y-6">
                    <h1 className="text-title-qr font-extralight text-wa-gray-dark">Use PingMe on your computer</h1>
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="text-wa-teal font-medium pt-1">1.</div>
                            <div><p className="text-step">Open PingMe on your phone</p></div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="text-wa-teal font-medium pt-1">2.</div>
                            <div><p className="text-step">Tap <span className="font-semibold text-wa-black">Menu</span> or <span className="font-semibold text-wa-black">Settings</span> and select <span className="font-semibold text-wa-black">Linked Devices</span></p></div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="text-wa-teal font-medium pt-1">3.</div>
                            <div><p className="text-step">Tap on <span className="font-semibold text-wa-black">Link a device</span></p></div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="text-wa-teal font-medium pt-1">4.</div>
                            <div><p className="text-step">Enter the code shown on the right into your phone</p></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Code Section */}
            <div className="w-full md-w-sidebar bg-white p-12 md-p-16 flex flex-col items-center justify-center gap-10">
                <div className="flex flex-col items-center gap-6">
                    <div className="size-16 bg-wa-teal/10 rounded-full flex items-center justify-center mb-2">
                        <Monitor className="size-8 text-wa-teal" />
                    </div>
                    <h2 className="text-xl font-medium text-wa-black">Enter Pairing Code</h2>
                </div>

                <div className="flex gap-2">
                    {!pairingCode ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader className="size-10 animate-spin text-wa-teal" />
                        </div>
                    ) : (
                        <div className="flex gap-2 group relative">
                            {pairingCode.split('').map((digit, i) => (
                                <div key={i} className="size-12 md-size-14 bg-zinc-50 border-2 border-zinc-100 rounded-xl flex items-center justify-center text-3xl font-mono font-bold text-wa-teal shadow-sm">
                                    {digit}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-sm text-wa-gray max-w-200">This code is unique to this session and expires soon.</p>
                    <div className="flex items-center gap-2 text-wa-gray opacity-60">
                        <Shield className="size-3.5" />
                        <span className="text-xs">End-to-end encrypted</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-12 text-wa-gray text-small hidden md-flex items-center gap-2 pb-12">
            <Smartphone className="size-4" />
            <p>Link up to 4 devices</p>
        </div>
    </div>
);
}
