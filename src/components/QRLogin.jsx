import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { QRCode } from "react-qrcode-logo";
import { MoreVertical, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function QRLogin() {
    const { initiatePairing, pairingCode } = useAuthStore();

    useEffect(() => {
        initiatePairing();
        const interval = setInterval(initiatePairing, 60000);
        return () => clearInterval(interval);
    }, [initiatePairing]);

    return (
        <div className="h-screen w-full bg-[#111b21] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="h-[220px] bg-[#00a884] w-full absolute top-0 left-0 z-0">
                <div className="max-w-[1000px] mx-auto h-full flex items-center px-6 pt-8 items-start">
                    <div className="flex items-center gap-3 text-white font-bold text-sm tracking-wide uppercase">
                        <div className="size-10 bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
                            <img src="/logo.png" className="w-full h-full object-contain" alt="Logo" />
                        </div>
                        <span className="text-[19px]">PingMe Web</span>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="z-10 bg-white dark:bg-[#111b21] rounded-[3px] shadow-[0_17px_50px_0_rgba(0,0,0,0.19),0_12px_15px_0_rgba(0,0,0,0.24)] w-[90%] max-w-[1000px] h-[72%] mx-auto mt-28 flex overflow-hidden border border-[#2f3b43]"
            >
                {/* Left Side: Instructions */}
                <div className="flex-1 p-10 md:p-14 text-[#e9edef]">
                    <h1 className="text-[28px] font-light text-[#e9edef] mb-10">Use PingMe on your computer</h1>

                    <ol className="space-y-6 list-decimal list-outside ml-5 text-[18px] leading-[28px] text-[#e9edef]">
                        <li>Open PingMe on your phone</li>
                        <li>Tap <strong>Menu</strong> <MoreVertical className="inline size-4 bg-[#202c33] px-0.5 rounded" /> or <strong>Settings</strong> <Settings className="inline size-4 bg-[#202c33] px-0.5 rounded" /> and select <strong>Linked Devices</strong></li>
                        <li>Tap on <strong>Link a Device</strong></li>
                        <li>Point your phone to this screen to capture the code</li>
                    </ol>

                    <div className="mt-12 text-[#00a884] text-[15px] font-medium hover:underline cursor-pointer">
                        Need help to get started?
                    </div>
                </div>

                {/* Right Side: QR Code */}
                <div className="w-[400px] p-10 flex flex-col items-center justify-center border-l border-[#2f3b43]">
                    <div className="relative">
                        <div className="bg-white p-2 rounded-lg relative overflow-hidden group">
                            {pairingCode ? (
                                <QRCode
                                    value={pairingCode}
                                    size={264}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    fgColor="#111b21"
                                />
                            ) : (
                                <div className="size-[264px] flex items-center justify-center bg-gray-100">
                                    <div className="size-10 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}

                            {/* Logo Overlay */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full overflow-hidden">
                                <img src="/logo.png" className="size-10 object-contain" alt="Logo" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2">
                        <div className="checkbox-wrapper-1">
                            <input id="keep-signed-in" type="checkbox" className="accent-[#00a884]" defaultChecked />
                            <label htmlFor="keep-signed-in" className="text-[#e9edef] text-[15px] ml-2 cursor-pointer">Keep me signed in</label>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
