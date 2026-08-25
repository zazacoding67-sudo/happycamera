"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  visible,
  onClose,
  duration = 4000,
}: ToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      const t = setTimeout(() => {
        setMounted(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(t);
    }
  }, [visible, duration, onClose]);

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 right-4 z-[100] max-w-sm"
        >
          <div
            className={`flex items-start gap-3 px-4 py-3 border shadow-sm ${
              type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            {type === "success" ? (
              <CheckCircle size={18} className="text-green-600 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
            )}
            <p
              className={`text-sm flex-1 ${
                type === "success" ? "text-green-800" : "text-red-800"
              }`}
            >
              {message}
            </p>
            <button
              onClick={() => {
                setMounted(false);
                setTimeout(onClose, 300);
              }}
              className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
