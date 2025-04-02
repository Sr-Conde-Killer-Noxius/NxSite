"use client"

export default function GlowingBackground(){
    return <>
        {/* Glowing Background Effect */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 pointer-events-none" />
                
        {/* Grid Pattern Overlay */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
    </>
}