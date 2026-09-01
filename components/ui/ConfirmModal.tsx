"use client";

import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-sm p-8 text-center">
        <button
          onClick={onCancel}
          className="float-right p-1 text-[#666] hover:text-[#1A1A1A] transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div className="w-10 h-10 mx-auto flex items-center justify-center mt-4">
          <AlertTriangle
            size={22}
            className={
              variant === "danger" ? "text-red-500" : "text-[#666]"
            }
          />
        </div>
        <h1 className="mt-4 text-lg font-bold tracking-tight text-[#1A1A1A]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[#666] leading-relaxed">{message}</p>
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-[#E5E5E5] px-4 py-2.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors rounded-none"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 text-white text-sm font-medium px-4 py-2.5 hover:opacity-90 transition-opacity rounded-none ${
              variant === "danger"
                ? "bg-red-600"
                : "bg-[#1A1A1A]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
