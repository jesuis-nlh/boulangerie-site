import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import styles from "./Legal.module.css";

export function LegalPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className={`wrap ${styles.page}`}>
      <header className={styles.head}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h2">{title}</h1>
        <div className="notice">
          <Icon name="alert" />
          <p style={{ margin: 0 }}>
            <strong>Modèle à compléter et à faire relire.</strong> Ce texte accompagne un site de démonstration pour une entreprise fictive.
            Il ne constitue pas un avis juridique : il doit être adapté et validé par un professionnel avant toute mise en ligne.
          </p>
        </div>
      </header>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
