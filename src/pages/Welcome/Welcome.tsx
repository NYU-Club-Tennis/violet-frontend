import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "assets/svgs/White-Athletic-logo-text.svg";
import { HomeLayoutStore } from "stores/home.layout.store";

const Welcome: React.FC = () => {
  const { loadWelcome, setLoadWelcome } = HomeLayoutStore();
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState("bg-black");
  const [logoOpacity, setLogoOpacity] = useState("opacity-100");
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (loadWelcome !== "true" && !isNavigating) {
      navigate("/");
      return;
    }

    // Start background transition to purple
    const bgTimer = setTimeout(() => {
      setBgColor("bg-nyu-purple-light");
    }, 100);

    // Start fade out (back to black and fade out logo)
    const fadeOutTimer = setTimeout(() => {
      setBgColor("bg-black");
      setLogoOpacity("opacity-0");
    }, 2000);

    // Set navigation flag before actual navigation
    const preNavTimer = setTimeout(() => {
      setIsNavigating(true);
    }, 2900);

    // Navigate after fade out completes
    const navTimer = setTimeout(() => {
      setLoadWelcome("false");
      navigate("/");
    }, 3000);

    return () => {
      clearTimeout(bgTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(preNavTimer);
      clearTimeout(navTimer);
    };
  }, []);

  // Keep the black background visible until navigation completes
  if (loadWelcome !== "true" && !isNavigating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 ${bgColor} flex flex-col items-center justify-center transition-colors duration-1000`}
    >
      <div
        className={`animate-fade-in ${logoOpacity} transition-opacity duration-1000`}
      >
        <img src={logo} alt="logo" className="w-64 h-64 animate-scale-in" />
      </div>
    </div>
  );
};

export default Welcome;
