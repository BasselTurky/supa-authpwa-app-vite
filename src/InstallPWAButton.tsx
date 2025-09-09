import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e); // save the event so we can trigger it later
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // show the native install prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User response to install:", outcome);

    setDeferredPrompt(null); // clear the saved prompt
  };

  if (!deferredPrompt) return null; // hide button if not installable

  return (
    <button
      onClick={handleInstallClick}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
      }}
    >
      Install App
    </button>
  );
}
