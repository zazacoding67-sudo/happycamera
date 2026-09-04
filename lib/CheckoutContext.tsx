"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  computeDeliveryCharge,
  type DeliveryMethod,
  type DeliveryRegion,
} from "@/lib/delivery";

const STORAGE_KEY = "happycamera_checkout";

export interface CheckoutInfo {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  deliveryMethod: DeliveryMethod;
  deliveryRegion: DeliveryRegion;
}

const EMPTY: CheckoutInfo = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  shippingAddress: "",
  deliveryMethod: "standard",
  deliveryRegion: "west_malaysia",
};

interface CheckoutContextValue {
  info: CheckoutInfo;
  hydrated: boolean;
  setInfo: (patch: Partial<CheckoutInfo>) => void;
  deliveryCharge: () => number;
  isContactComplete: () => boolean;
  isDeliveryComplete: () => boolean;
  clearCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

function loadInfo(): CheckoutInfo {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<CheckoutInfo>) };
  } catch {
    return EMPTY;
  }
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [info, setInfoState] = useState<CheckoutInfo>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setInfoState(loadInfo());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    } catch {
      /* ignore */
    }
  }, [info, hydrated]);

  const setInfo = useCallback((patch: Partial<CheckoutInfo>) => {
    setInfoState((prev) => ({ ...prev, ...patch }));
  }, []);

  const deliveryCharge = useCallback(() => {
    return computeDeliveryCharge(info.deliveryMethod, info.deliveryRegion);
  }, [info.deliveryMethod, info.deliveryRegion]);

  const isContactComplete = useCallback(() => {
    return (
      info.customerName.trim().length > 0 &&
      info.customerEmail.trim().length > 0 &&
      info.customerPhone.trim().length > 0
    );
  }, [info.customerName, info.customerEmail, info.customerPhone]);

  const isDeliveryComplete = useCallback(() => {
    if (info.deliveryMethod === "self_collect") return true;
    return info.shippingAddress.trim().length > 0;
  }, [info.deliveryMethod, info.shippingAddress]);

  const clearCheckout = useCallback(() => {
    setInfoState(EMPTY);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<CheckoutContextValue>(
    () => ({
      info,
      hydrated,
      setInfo,
      deliveryCharge,
      isContactComplete,
      isDeliveryComplete,
      clearCheckout,
    }),
    [info, hydrated, setInfo, deliveryCharge, isContactComplete, isDeliveryComplete, clearCheckout]
  );

  return (
    <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within <CheckoutProvider>");
  return ctx;
}
