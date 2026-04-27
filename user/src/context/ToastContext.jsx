import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ message, type = "success", duration = 2500 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const borderColor = { success: "border-green-200", error: "border-red-200", info: "border-blue-200" };
  const bgColor = { success: "bg-green-50", error: "bg-red-50", info: "bg-blue-50" };
  const iconColor = { success: "#16a34a", error: "#dc2626", info: "#2563eb" };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-7 right-7 flex flex-col gap-2.5 z-9999 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id}
            className={`flex items-center gap-3 bg-white rounded-xl shadow-lg px-4 py-3.5 border ${borderColor[toast.type]} min-w-65 max-w-sm pointer-events-auto animate-[toastIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]`}>
            <div className={`w-8 h-8 rounded-full ${bgColor[toast.type]} flex items-center justify-center shrink-0`}>
              {toast.type === "success" && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={iconColor.success} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
              {toast.type === "error" && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={iconColor.error} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              )}
              {toast.type === "info" && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={iconColor.info} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              )}
            </div>
            <span className="flex-1 text-sm font-medium text-gray-800 leading-snug">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 p-0.5 flex items-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateX(40px) scale(0.95) } to { opacity:1; transform:translateX(0) scale(1) } }`}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);