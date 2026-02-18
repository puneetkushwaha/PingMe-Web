import { Users } from "lucide-react";

const SidebarSkeleton = () => {
    // Create 8 skeleton items
    const skeletonContacts = Array(8).fill(null);

    return (
        <aside
            className="h-full w-full lg:w-[400px] border-r border-white/5 
    flex flex-col transition-all duration-200 bg-[#111b21]"
        >
            {/* Header */}
            <div className="border-b border-white/5 w-full p-4 h-16 flex items-center">
                <div className="flex items-center gap-2">
                    <div className="skeleton w-6 h-6 rounded bg-white/10" />
                    <div className="skeleton h-4 w-24 bg-white/10" />
                </div>
            </div>

            {/* Skeleton Contacts */}
            <div className="overflow-y-auto w-full py-3">
                {skeletonContacts.map((_, idx) => (
                    <div key={idx} className="w-full p-3 flex items-center gap-3">
                        {/* Avatar skeleton */}
                        <div className="relative mx-auto lg:mx-0">
                            <div className="skeleton size-12 rounded-full bg-white/10" />
                        </div>

                        {/* User info skeleton */}
                        <div className="hidden lg:block text-left min-w-0 flex-1">
                            <div className="skeleton h-4 w-32 mb-2 bg-white/10" />
                            <div className="skeleton h-3 w-16 bg-white/10" />
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default SidebarSkeleton;
