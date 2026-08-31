"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { GripVertical, X, ZoomIn, Maximize2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

const CROP_ASPECT = 4 / 3;

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(
  dataUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function createCroppedBlob(
  imageSrc: string,
  croppedAreaPct: Area,
  maxDimension = 2400
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      // Convert percentage coordinates to natural-image pixels
      let sx = (croppedAreaPct.x / 100) * img.naturalWidth;
      let sy = (croppedAreaPct.y / 100) * img.naturalHeight;
      let sWidth = (croppedAreaPct.width / 100) * img.naturalWidth;
      let sHeight = (croppedAreaPct.height / 100) * img.naturalHeight;

      // Clamp to image bounds
      sx = Math.max(0, Math.min(Math.round(sx), img.naturalWidth - 1));
      sy = Math.max(0, Math.min(Math.round(sy), img.naturalHeight - 1));
      sWidth = Math.min(Math.round(sWidth), img.naturalWidth - sx);
      sHeight = Math.min(Math.round(sHeight), img.naturalHeight - sy);
      sWidth = Math.max(1, sWidth);
      sHeight = Math.max(1, sHeight);

      // Determine destination canvas size (clamped to maxDimension)
      let dWidth = sWidth;
      let dHeight = sHeight;
      if (dWidth > maxDimension || dHeight > maxDimension) {
        const ratio = maxDimension / Math.max(dWidth, dHeight);
        dWidth = Math.round(dWidth * ratio);
        dHeight = Math.round(dHeight * ratio);
      }

      canvas.width = dWidth;
      canvas.height = dHeight;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob"));
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageSrc;
  });
}

export default function MultiImageUpload({
  images,
  onChange,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [lowResWarning, setLowResWarning] = useState<string | null>(null);

  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPct, setCroppedAreaPct] = useState<Area | null>(null);

  const [pendingQueue, setPendingQueue] = useState<
    { file: File; dataUrl: string }[]
  >([]);
  const [processingIndex, setProcessingIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const uploadedInBatchRef = useRef<string[]>([]);

  useEffect(() => {
    uploadedInBatchRef.current = images;
  }, [images]);

  const validateFile = useCallback((file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return "Unsupported file type. Please upload a JPEG, PNG, or WebP image.";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File is too large. Maximum file size is 5MB.";
    }
    return null;
  }, []);

  const resetToFit = useCallback(() => {
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  }, []);

  const openCropForIndex = useCallback(
    (queue: { file: File; dataUrl: string }[], index: number) => {
      const item = queue[index];

      setDataUrl(item.dataUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPct(null);
      setProcessingIndex(index);

      getImageDimensions(item.dataUrl).then((dims) => {
        if (dims.width < 800) {
          setLowResWarning(
            `This image is only ${dims.width}px wide — crops may look soft. For best results, use photos at least 800px wide.`
          );
        } else {
          setLowResWarning(null);
        }
      });
    },
    []
  );

  const closeCropModal = useCallback(() => {
    setDataUrl(null);
    setProcessingIndex(-1);
    setPendingQueue([]);
    setUploading(false);
    setLowResWarning(null);
    uploadedInBatchRef.current = [];
  }, []);

  const processNext = useCallback(
    (queue: { file: File; dataUrl: string }[], currentIndex: number) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < queue.length) {
        openCropForIndex(queue, nextIndex);
      } else {
        closeCropModal();
      }
    },
    [openCropForIndex, closeCropModal]
  );

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (inputRef.current) inputRef.current.value = "";

    if (!supabase) {
      console.error("Supabase client not initialized");
      return;
    }

    setValidationError(null);
    setLowResWarning(null);

    const errors: string[] = [];
    const valid: { file: File; dataUrl: string }[] = [];

    for (const file of files) {
      const err = validateFile(file);
      if (err) {
        errors.push(`${file.name}: ${err}`);
      } else {
        const dataUrl = await readFileAsDataURL(file);
        valid.push({ file, dataUrl });
      }
    }

    if (errors.length > 0) {
      setValidationError(errors.join("\n"));
    }

    if (valid.length === 0) return;

    uploadedInBatchRef.current = images;
    setPendingQueue(valid);
    setUploading(true);
    openCropForIndex(valid, 0);
  };

  const handleCropConfirm = async () => {
    if (!dataUrl || !croppedAreaPct || processingIndex < 0) return;
    if (!supabase) {
      setValidationError("Storage not configured.");
      closeCropModal();
      return;
    }

    const currentFile = pendingQueue[processingIndex];
    if (!currentFile) return;

    const sourceDataUrl = dataUrl;
    const currentIndex = processingIndex;
    setDataUrl(null);

    try {
      const blob = await createCroppedBlob(sourceDataUrl, croppedAreaPct);

      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

      const { data, error } = await supabase.storage
        .from("camera-images")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from("camera-images")
          .getPublicUrl(data.path);

        uploadedInBatchRef.current = [...uploadedInBatchRef.current, urlData.publicUrl];
        onChange(uploadedInBatchRef.current);
        processNext(pendingQueue, currentIndex);
      } else {
        console.error("Upload failed", error);
        setValidationError("Upload failed. Please try again.");
        closeCropModal();
      }
    } catch (err) {
      console.error("Crop/upload error", err);
      setValidationError("Something went wrong. Please try again.");
      closeCropModal();
    }
  };

  const handleCropCancel = () => {
    processNext(pendingQueue, processingIndex);
  };

  const onCropComplete = useCallback((croppedArea: Area, _: Area) => {
    setCroppedAreaPct(croppedArea);
  }, []);

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const showModal = dataUrl !== null;

  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
        Images
      </label>

      {images.length === 0 && !uploading && (
        <p className="mt-2 text-xs text-[#888] leading-relaxed">
          Recommended: 2000–2400px on the longest side, JPEG or WebP.
          You&rsquo;ll be able to crop it to the right shape after selecting it.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        disabled={uploading}
        className="mt-1 w-full text-sm text-[#666] file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-[#F5F5F5] file:text-[#1A1A1A] hover:file:bg-[#E5E5E5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {validationError && (
        <p className="mt-1 text-xs text-red-500 whitespace-pre-wrap">
          {validationError}
        </p>
      )}

      {uploading && !showModal && (
        <p className="mt-1 text-xs text-[#888]">Processing images...</p>
      )}

      {images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="w-24 h-24 md:w-20 md:h-20 object-cover border border-[#E5E5E5]"
              />
              <div className="absolute inset-0 bg-black/40 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 md:gap-1">
                <button
                  type="button"
                  onClick={() => moveImage(i, Math.max(0, i - 1))}
                  disabled={i === 0}
                  className="p-2.5 md:p-1 text-white disabled:opacity-30"
                >
                  <GripVertical className="size-5 md:size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-2.5 md:p-1 text-white hover:text-red-300 transition-colors"
                >
                  <X className="size-5 md:size-3.5" />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 text-[8px] font-bold uppercase tracking-widest bg-black/70 text-white px-1 py-0.5">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl bg-white flex flex-col">
            <div className="relative w-full h-[400px] bg-[#1A1A1A]">
              <Cropper
                image={dataUrl}
                crop={crop}
                zoom={zoom}
                aspect={CROP_ASPECT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="p-4">
              {lowResWarning && (
                <p className="text-xs text-amber-600 mb-3">{lowResWarning}</p>
              )}

              <div className="flex items-center gap-3 mb-4">
                <ZoomIn size={14} className="text-[#888] shrink-0" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#1A1A1A]"
                />
                <ZoomIn size={16} className="text-[#666] shrink-0" />
                <button
                  type="button"
                  onClick={resetToFit}
                  className="p-1.5 border border-[#E5E5E5] hover:bg-[#F5F5F5] transition-colors"
                  title="Reset zoom"
                  aria-label="Reset zoom"
                >
                  <Maximize2 size={14} className="text-[#666]" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCropCancel}
                  className="flex-1 border border-[#E5E5E5] px-4 py-2.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropConfirm}
                  className="flex-1 bg-[#1A1A1A] text-white text-sm font-medium px-4 py-2.5 hover:bg-[#333] transition-colors"
                >
                  Confirm crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
