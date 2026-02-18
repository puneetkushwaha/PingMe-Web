import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center p-16 bg-[#222e35]/30">
            <div className="flex flex-col items-center text-center space-y-6">
                {/* Illustration */}
                <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center p-8 relative shadow-2xl">
                    <img src="/logo.png" alt="PingMe Web" className="w-full h-full object-contain opacity-90" />
                </div>

                {/* Text Content */}
                <div className="max-w-md space-y-4">
                    <h2 className="text-[#e9edef] text-[32px] font-light leading-normal">
                        PingMe Web
                    </h2>
                    <p className="text-[#8696a0] text-sm leading-6">
                        Send and receive messages without keeping your phone online. <br />
                        Use PingMe on up to 4 linked devices and 1 phone.
                    </p>
                </div>

                {/* E2EE Badge */}
                <div className="absolute bottom-10 flex items-center gap-1.5 text-[#8696a0] text-[13px]">
                    <span className="size-2.5 rounded-full border border-[#8696a0] flex items-center justify-center">
                        <span className="size-1.5 rounded-full bg-[#8696a0]"></span>
                    </span>
                    End-to-end encrypted
                </div>
            </div>
        </div>
    );
};

export default NoChatSelected;
