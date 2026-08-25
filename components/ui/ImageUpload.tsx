"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      console.error("Supabase client not initialized");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("camera-images")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("camera-images")
      .getPublicUrl(data.path);

    onUpload(urlData.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
        Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="mt-1 w-full text-sm text-[#666] file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-[#F5F5F5] file:text-[#1A1A1A] hover:file:bg-[#E5E5E5] transition-colors cursor-pointer"
      />
      {uploading && <p className="mt-1 text-xs text-[#888]">Uploading...</p>}
    </div>
  );
}
