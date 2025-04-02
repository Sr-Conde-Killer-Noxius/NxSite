"use client"
import Script from "next/script"
import React, { useEffect } from "react"


interface AdSenseProps{
    adId: string
}
declare global {
    interface window {
        adsbygoogle: any | any[]
    }
}

const AdSense = ({ adId }: AdSenseProps): React.ReactElement => {
    useEffect(() => {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
        }
        catch {}
    }, [])

    return (
        <script 
            async 
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8527210526030632"
            crossOrigin="anonymous"/>        
    )
}
export default AdSense