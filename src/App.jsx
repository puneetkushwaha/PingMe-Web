import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import QRLogin from "./components/QRLogin";
import Dashboard from "./components/Dashboard";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { subscribeToMessages, unsubscribeFromMessages } = useChatStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [authUser, subscribeToMessages, unsubscribeFromMessages]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#111b21]">
        <Loader className="size-10 animate-spin text-[#00a884]" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      {!authUser ? <QRLogin /> : <Dashboard />}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
