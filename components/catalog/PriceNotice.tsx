import { Icon } from "@/components/Icon";
import { bakery } from "@/config/bakery";

/** Mentions de prix et d'information alimentaire, communes au catalogue et aux fiches. */
export function PriceNotice() {
  return (
    <div className="notice" style={{ marginTop: "2.5rem" }}>
      <Icon name="info" />
      <p style={{ margin: 0 }}>
        Prix en euros, toutes taxes comprises. Pour les pains de 200 g et plus, le prix au kilo est indiqué. Les allergènes sont
        affichés par écrit en boutique, à côté de chaque produit.
        {bakery.isDemo && (
          <>
            {" "}
            <strong>Démonstration : produits et prix fictifs.</strong>
          </>
        )}
      </p>
    </div>
  );
}
