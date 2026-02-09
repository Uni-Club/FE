"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

interface PromptOptions extends ConfirmOptions {
  placeholder?: string;
  defaultValue?: string;
}

interface ConfirmContextType {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  prompt: (opts: PromptOptions) => Promise<string | null>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions & { isPrompt?: boolean; placeholder?: string; defaultValue?: string }>({
    title: "",
  });
  const [inputValue, setInputValue] = useState("");
  const resolveRef = useRef<((value: boolean | string | null) => void) | null>(null);

  const showConfirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({ ...opts, isPrompt: false });
      setInputValue("");
      setOpen(true);
      resolveRef.current = resolve as (value: boolean | string | null) => void;
    });
  }, []);

  const showPrompt = useCallback((opts: PromptOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      setOptions({ ...opts, isPrompt: true, placeholder: opts.placeholder, defaultValue: opts.defaultValue });
      setInputValue(opts.defaultValue || "");
      setOpen(true);
      resolveRef.current = resolve as (value: boolean | string | null) => void;
    });
  }, []);

  const handleConfirm = () => {
    setOpen(false);
    if (options.isPrompt) {
      resolveRef.current?.(inputValue || null);
    } else {
      resolveRef.current?.(true);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    if (options.isPrompt) {
      resolveRef.current?.(null);
    } else {
      resolveRef.current?.(false);
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm: showConfirm, prompt: showPrompt }}>
      {children}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[101]"
              onClick={handleCancel}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[102] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md bg-white rounded-2xl shadow-soft-xl p-6"
            >
              <div className="flex items-start gap-4">
                {options.variant === "destructive" && (
                  <div className="shrink-0 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900">{options.title}</h3>
                  {options.description && (
                    <p className="text-sm text-slate-500 mt-1">{options.description}</p>
                  )}
                  {options.isPrompt && (
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={options.placeholder}
                      className="mt-3 w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleConfirm();
                        if (e.key === "Escape") handleCancel();
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={handleCancel}>
                  {options.cancelText || "취소"}
                </Button>
                <Button
                  variant={options.variant === "destructive" ? "destructive" : "default"}
                  onClick={handleConfirm}
                >
                  {options.confirmText || "확인"}
                </Button>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used within ConfirmProvider");
  return context.confirm;
}

export function usePrompt() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("usePrompt must be used within ConfirmProvider");
  return context.prompt;
}
