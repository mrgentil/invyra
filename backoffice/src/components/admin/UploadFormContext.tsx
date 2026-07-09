"use client";

import { createContext, useContext, useState } from "react";

type UploadFormContextValue = {
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
};

const UploadFormContext = createContext<UploadFormContextValue | null>(null);

export function UploadFormProvider({ children }: { children: React.ReactNode }) {
  const [isUploading, setIsUploading] = useState(false);
  return (
    <UploadFormContext.Provider value={{ isUploading, setIsUploading }}>
      {children}
    </UploadFormContext.Provider>
  );
}

export function useUploadForm() {
  const ctx = useContext(UploadFormContext);
  if (!ctx) {
    return { isUploading: false, setIsUploading: () => {} };
  }
  return ctx;
}
