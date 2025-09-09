import { useEffect, useState } from "react";
import PWAPrompt from "react-ios-pwa-prompt";

export default function InstallPWAButtoniOS() {
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios =
      /iphone|ipad|ipod/.test(userAgent) && !window.navigator.userAgent.includes("Macintosh");
    setIsIos(ios);
  }, []);

  return (
    <>
      {/* Show iOS install prompt only if running on iOS */}
      {isIos && <PWAPrompt
          copyTitle="Install this app"
          copyDescription="Tap Share → Add to Home Screen to install this PWA."
          timesToShow={3}
          copyShareStep="Press the 'Share' button on the menu bar below"
          copyAddToHomeScreenStep="Add to Home Screen"
          isShown={true}
          delay={1000}
          appIconPath="./assets/react.svg"
          
      />}
        <div>
        {isIos && <p>iOS device</p>}
      </div>
    </>
  );
}
