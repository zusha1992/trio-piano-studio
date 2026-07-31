// Shop inventory types.
//
// The store content itself now lives in D1 (see src/lib/content.ts) and is
// managed through the admin CMS; this module only defines the shared shape of a
// piano used across the store pages and the editor.

export type ShopType = 'grand' | 'upright';
// Origin id — references a row in the `origins` library table. Kept as a free
// string so new origins can be added at runtime.
export type ShopRegion = string;

export interface LocalizedText {
  en: string;
  he: string;
  ar?: string;
  ru?: string;
}

export interface ShopColor {
  /** Swatch color. */
  hex: string;
  name: LocalizedText;
}

/** Physical dimensions in centimeters, used for the size illustration. */
export interface ShopDimensions {
  width: number;
  height: number;
  /** Depth for uprights / overall length for grands. */
  depth: number;
}

export interface ShopItem {
  id: string;
  brand: string;
  /** Model designation (e.g. U1, U3, CX-21). Empty for grands with no model. */
  model: string;
  type: ShopType;
  /** Manufacturer serial number, when known. Shown as the gallery subheader. */
  serial?: string;
  /** Origin region, used as a store filter facet + shown on the detail page. */
  region: ShopRegion;
  /** Height for uprights / length for grands, shown next to the model. */
  size: string;
  /** Year of manufacture, when known. Shown as a spec on the detail page. */
  year?: number;
  /** ILS price, or 'contact' when priced on request. */
  price: number | 'contact';
  color: ShopColor;
  dimensions: ShopDimensions;
  /** Primary image (tile + detail gallery fallback). */
  image: string;
  /** Optional extra images for the detail-page gallery/carousel. */
  images?: string[];
  /** Gallery images with ids (admin edit; first is the tile/main image). */
  galleryImages?: { id: number; url: string }[];
  /** Optional per-item description; falls back to a generated line. */
  description?: LocalizedText;
  /** Optional second paragraph with more background / model history. */
  details?: LocalizedText;
  /** True while the piano is still being restored and is not yet for sale. */
  wip?: boolean;
  /** Draft flag — hidden from the public store when false. */
  published?: boolean;
}
