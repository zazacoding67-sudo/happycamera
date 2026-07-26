"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag, Heart } from "lucide-react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { useNavVisibility } from "@/lib/useNavVisibility";
import SearchModal from "@/components/layout/SearchModal";
import MegaMenu from "@/components/layout/MegaMenu";
import { navigationMenus } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { materialEase } from "@/lib/motion";

const OVERLAY_DELAY = 50;
const SYNTHETIC_EVENT_WINDOW = 500;
const IGNORE_DOCUMENT_WINDOW = 200;

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchOpened = useRef(false);
  const navRoot = useRef<HTMLDivElement>(null);
  const isTouch = useRef(false);
  const lastTouchTime = useRef(0);
  const ignoreNextClose = useRef(false);
  const { openCart, isOpen: cartOpen, items, lastAddedId } = useCart();
  const { openWishlist, isOpen: wishlistOpen, items: wishlistItems } = useWishlist();
  const scrollVisible = useNavVisibility();

  const isVisible =
    scrollVisible ||
    activeMenu !== null ||
    mobileOpen ||
    cartOpen ||
    wishlistOpen;

  useEffect(() => {
    isTouch.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  const isSyntheticFromTouch = useCallback(() => {
    return Date.now() - lastTouchTime.current < SYNTHETIC_EVENT_WINDOW;
  }, []);

  useEffect(() => {
    if (!activeMenu) {
      setOverlayVisible(false);
      return;
    }
    const id = setTimeout(() => setOverlayVisible(true), OVERLAY_DELAY);
    return () => clearTimeout(id);
  }, [activeMenu]);

  const scheduleClose = useCallback(() => {
    if (touchOpened.current || isSyntheticFromTouch()) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  }, [isSyntheticFromTouch]);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const openMenu = useCallback(
    (title: string) => {
      if (isSyntheticFromTouch()) return;
      cancelClose();
      setActiveMenu(title);
    },
    [cancelClose, isSyntheticFromTouch]
  );

  const closeMenu = useCallback(() => {
    touchOpened.current = false;
    setActiveMenu(null);
    setHoveredLink(null);
  }, []);

  const toggleMenu = useCallback(
    (title: string) => {
      cancelClose();
      setActiveMenu((prev) => {
        if (prev === title) {
          touchOpened.current = false;
          return null;
        }
        touchOpened.current = true;
        ignoreNextClose.current = true;
        setTimeout(() => {
          ignoreNextClose.current = false;
        }, IGNORE_DOCUMENT_WINDOW);
        return title;
      });
    },
    [cancelClose]
  );

  useEffect(() => {
    if (!activeMenu) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ignoreNextClose.current) return;
      const target = e.target as HTMLElement;
      if (navRoot.current && !navRoot.current.contains(target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [activeMenu, closeMenu]);

  const onTouchStart = useCallback(() => {
    lastTouchTime.current = Date.now();
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <AnimatePresence>
        {activeMenu && overlayVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: materialEase }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <div
        ref={navRoot}
        className="fixed top-0 inset-x-0 z-50"
        onTouchStart={onTouchStart}
      >
        <motion.div
          animate={{ y: isVisible ? 0 : "-100%" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ willChange: "transform" }}
        >
          <nav className="bg-yellow-400 border-b border-black/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-3 items-center">
              <div className="flex items-center justify-start gap-6">
                <button
                  className="md:hidden p-2 text-black -ml-2"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                <div
                  className="hidden md:flex items-center gap-6"
                  onMouseEnter={cancelClose}
                  onMouseLeave={() => {
                    setHoveredLink(null);
                    scheduleClose();
                  }}
                >
                  <LayoutGroup>
                    {navigationMenus.map((menu, i) => (
                      <div
                        key={menu.name}
                        className="relative h-16 flex items-center"
                        onMouseEnter={() => {
                          setHoveredLink(i);
                          openMenu(menu.name);
                        }}
                      >
                        <Link
                          href={menu.path}
                          className="text-[14px] font-medium text-black uppercase tracking-[0.12em]"
                        >
                          {menu.name}
                        </Link>
                        <div
                          className="absolute inset-0"
                          onClick={() => toggleMenu(menu.name)}
                        />
                        {hoveredLink === i && (
                          <motion.div
                            layoutId="nav-underline"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </div>
                    ))}
                  </LayoutGroup>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/images/logo-transparent.png"
                    alt="Happy Camera"
                    width={58}
                    height={58}
                    priority
                    quality={100}
                    className="h-12 md:h-[58px] w-auto object-contain"
                  />
                </Link>
              </div>

              <div className="flex items-center justify-end gap-5">
                <SearchModal />
                <button
                  onClick={openWishlist}
                  className="relative text-black group"
                  aria-label="Wishlist"
                >
                  <Heart
                    size={22}
                    className={cn(
                      wishlistItems.length > 0 ? "fill-black" : ""
                    )}
                  />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none" />
                </button>
                <button
                  onClick={openCart}
                  className="relative text-black group"
                  aria-label="Cart"
                >
                  <ShoppingBag size={22} />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none" />
                  <AnimatePresence mode="popLayout">
                    {totalItems > 0 && (
                      <motion.span
                        key={lastAddedId}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-[#1A1A1A] rounded-full"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </nav>

          <AnimatePresence>
            {activeMenu && (
              <div
                className="relative z-50"
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
              >
                {navigationMenus
                  .filter((m) => m.name === activeMenu)
                  .map((m) => (
                    <MegaMenu key={m.name} menu={m} />
                  ))}
              </div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t-2 border-yellow-400",
              mobileOpen ? "max-h-96" : "max-h-0"
            )}
          >
            <div className="flex flex-col px-4 py-4 gap-3">
              {navigationMenus.map((menu) => (
                <Link
                  key={menu.name}
                  href={menu.path}
                  onClick={() => setMobileOpen(false)}
                  className="text-[14px] font-medium text-black uppercase tracking-[0.12em]"
                >
                  {menu.name}
                </Link>
              ))}

            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;
