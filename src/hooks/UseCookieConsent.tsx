"use client"
import { useEffect, useState } from "react";
import { useCookie } from "./UseCookie";

export function useCookieConsent() {    
    const [hasConsent, setConsent] = useState<boolean>(useCookie.HasCookieConsent())      
  
    const acceptCookies = () => {      
      localStorage.setItem("cookieConsent", "true");
      setConsent(true);
    };
  
    const declineCookies = () => {
      setConsent(false);
    };

    useEffect(() => {
      const consent = localStorage.getItem("cookieConsent");
      setConsent(consent === "true");
    }, []);
    
    return { hasConsent, acceptCookies, declineCookies };
  }

