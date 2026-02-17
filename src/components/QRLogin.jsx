import { useEffect, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { useAuthStore } from "../store/useAuthStore";
import { Monitor, Smartphone, Loader, Shield } from "lucide-react";

export default function QRLogin() {
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
