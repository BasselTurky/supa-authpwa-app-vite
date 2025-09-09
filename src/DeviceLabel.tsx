import { useEffect, useState } from "react";

export default function DeviceLabel() {
  const [device, setDevice] = useState<"desktop" | "android" | "ios">("desktop");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    if (/iphone/.test(ua)) {
      setDevice("ios");
    } 
    else if (/android/.test(ua)) {
      // Consider as smartphone if width <= 768px
      if (window.innerWidth <= 768) {
        setDevice("android");
      } else {
        setDevice("desktop"); // Android tablet
      }
    } 
    else {
      setDevice("desktop");
    }
  }, []);

  return (
    <p style={{ textAlign: "center", marginTop: "20px" }}>
      {device}
    </p>
  );
}
