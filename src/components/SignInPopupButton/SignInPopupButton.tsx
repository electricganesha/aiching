// "use client" if inside app/ layout
"use client";
import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "../Button/Button";

export default function SignInPopupButton() {
  const { update } = useSession(); // update() will refresh session in next-auth v5

  const openPopup = useCallback(() => {
    const w = 600,
      h = 650;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open(
      "/auth/popup",
      "AuthPopup",
      `width=${w},height=${h},left=${left},top=${top}`
    );

    if (!popup) {
      alert("Popup blocked — allow popups for this site.");
      return;
    }

    // Wait for a message from the popup callback page
    return new Promise<void>((resolve, reject) => {
      const onMessage = async (ev: MessageEvent) => {
        if (ev.origin !== window.location.origin) return;
        const data = ev.data;
        if (data?.type !== "next-auth-popup") return;
        window.removeEventListener("message", onMessage);
        clearInterval(checkClosed);
        if (data.status === "success") {
          try {
            if (update) await update(); // refresh next-auth session client-side
            else window.location.reload(); // fallback
          } catch {
            window.location.reload();
          }
          resolve();
        } else {
          reject(new Error(data?.error || "Authentication failed"));
        }
      };
      window.addEventListener("message", onMessage);

      // fallback: detect if user closed the popup manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", onMessage);
          reject(new Error("Popup closed by user"));
        }
      }, 500);
    }).catch((err) => {
      console.error("Auth popup error:", err);
    });
  }, [update]);

  return (
    <Button onClick={() => openPopup()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
        />
      </svg>
      <span>Sign in</span>
    </Button>
  );
}
