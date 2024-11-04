"use client";
import RetroGrid from "@/components/ui/retro-grid";

export default function HeroRetroGrid() {
    return (
        <div className="relative flex h-[calc(100vh_-_5rem)] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
            <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-br from-[#5b4da1] via-[#a33793] to-[#d91f89] bg-clip-text text-center md:text-7xl text-5xl p-4 -mt-24 font-bold leading-none tracking-tighter text-transparent">
                CBIT Open Source Community's
            </span>
            <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-br from-[#d91f89] via-[#a33793] to-[#5b4da1] bg-clip-text text-center md:text-4xl text-3xl py-4 font-bold leading-none tracking-tighter text-transparent">
                QR certificate generator
            </span>
            <RetroGrid />
        </div>
    );
}
