import { Instrument_Serif, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";

export const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display", display: "swap" });
export const text = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-text", display: "swap" });
export const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });
