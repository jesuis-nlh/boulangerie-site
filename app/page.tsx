import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Signatures } from "@/components/home/Signatures";
import { Fournil } from "@/components/home/Fournil";
import { CategoryIndex } from "@/components/home/CategoryIndex";
import { Engagements } from "@/components/home/Engagements";
import { ClickCollect } from "@/components/home/ClickCollect";
import { SurMesure } from "@/components/home/SurMesure";
import { Visit } from "@/components/home/Visit";
import { FinalCta } from "@/components/home/FinalCta";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Trame — Boulangerie au levain à la Croix-Rousse, Lyon",
    description:
      "Boulangerie au levain naturel sur les pentes de la Croix-Rousse (Lyon 1er) : miches, baguette de tradition, croissants, brioche et tarte aux pralines. Commandez en ligne, retirez en boutique.",
    path: "/",
  }),
  title: { absolute: "Trame — Boulangerie au levain à la Croix-Rousse, Lyon" },
};

export default function Home() {
  return (
    <>
      <Hero />
      {/* Sections sous la ligne de flottaison : rendu différé (voir .cv) */}
      <div className="cv">
        <Manifesto />
      </div>
      <div className="cv" style={{ containIntrinsicSize: "auto 3600px" }}>
        <Signatures />
      </div>
      <div className="cv" style={{ containIntrinsicSize: "auto 2600px" }}>
        <Fournil />
      </div>
      <div className="cv">
        <CategoryIndex />
      </div>
      <div className="cv">
        <Engagements />
      </div>
      <div className="cv">
        <ClickCollect />
      </div>
      <div className="cv">
        <SurMesure />
      </div>
      <div className="cv" style={{ containIntrinsicSize: "auto 1500px" }}>
        <Visit />
      </div>
      <div className="cv" style={{ containIntrinsicSize: "auto 800px" }}>
        <FinalCta />
      </div>
    </>
  );
}
