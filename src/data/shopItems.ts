// Shop inventory.
//
// This is intentionally a plain, flat array so it can later be replaced by a
// CMS / database source without touching the gallery/detail layouts: the store
// renders whatever items live here (any amount). To add an item, append an
// object with a unique id.

export type ShopType = 'grand' | 'upright';
export type ShopRegion = 'japan' | 'europe' | 'usa';

export interface LocalizedText {
  en: string;
  he: string;
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
  depth: number;
}

export interface ShopItem {
  id: string;
  brand: string;
  model: string;
  type: ShopType;
  /** Origin region, used as a store filter facet + shown on the detail page. */
  region: ShopRegion;
  /** Length for grands / height for uprights, shown next to the model. */
  size: string;
  /** ILS price, or 'contact' when priced on request */
  price: number | 'contact';
  color: ShopColor;
  dimensions: ShopDimensions;
  /** Primary image (tile + detail gallery fallback). */
  image: string;
  /** Optional extra images for the detail-page gallery/carousel. */
  images?: string[];
  /** Optional per-item description; falls back to a generated line. */
  description?: LocalizedText;
}

// Shared finishes (placeholder data).
const EBONY: ShopColor = { hex: '#1b1b1d', name: { en: 'Ebony Black', he: 'שחור' } };
const WHITE: ShopColor = { hex: '#f1efe9', name: { en: 'Polished White', he: 'לבן' } };
const MAHOGANY: ShopColor = { hex: '#5b2a14', name: { en: 'Mahogany', he: 'מהגוני' } };
const WALNUT: ShopColor = { hex: '#6b4423', name: { en: 'Walnut', he: 'אגוז' } };

export const shopItems: ShopItem[] = [
  { id: 'p1', brand: 'Steinway & Sons', model: 'Concert 132', type: 'upright', region: 'europe', size: '52"', price: 28000, color: EBONY, dimensions: { width: 152, height: 132, depth: 63 }, image: '/images/shop/piano_01.jpeg' },
  { id: 'p2', brand: 'Steinway & Sons', model: 'Model D Artcase', type: 'grand', region: 'usa', size: "8' 11¾\"", price: 'contact', color: MAHOGANY, dimensions: { width: 156, height: 102, depth: 274 }, image: '/images/shop/piano_02.jpeg' },
  { id: 'p3', brand: 'Kawai', model: 'Parlor Grand', type: 'grand', region: 'usa', size: "5' 4\"", price: 22000, color: WALNUT, dimensions: { width: 150, height: 101, depth: 163 }, image: '/images/shop/piano_03.jpeg' },
  { id: 'p4', brand: 'Yamaha', model: 'U1', type: 'upright', region: 'japan', size: '48"', price: 18500, color: EBONY, dimensions: { width: 149, height: 121, depth: 61 }, image: '/images/shop/piano_04.jpeg' },
  { id: 'p5', brand: 'Steinway & Sons', model: 'Model 200', type: 'grand', region: 'europe', size: "6' 7\"", price: 'contact', color: EBONY, dimensions: { width: 151, height: 101, depth: 200 }, image: '/images/shop/piano_05.jpeg' },
  { id: 'p6', brand: 'Kawai', model: 'Model 214 Mahogany', type: 'grand', region: 'europe', size: "7' 0\"", price: 'contact', color: MAHOGANY, dimensions: { width: 151, height: 102, depth: 214 }, image: '/images/shop/piano_06.webp' },
  { id: 'p7', brand: 'Yamaha', model: 'Model 170', type: 'grand', region: 'europe', size: "5' 8\"", price: 'contact', color: EBONY, dimensions: { width: 150, height: 101, depth: 170 }, image: '/images/shop/piano_07.jpeg' },
  { id: 'p8', brand: 'Kawai', model: 'Model 11', type: 'grand', region: 'europe', size: "5' 1\"", price: 45000, color: WALNUT, dimensions: { width: 149, height: 100, depth: 155 }, image: '/images/shop/piano_08.jpeg' },
  { id: 'p9', brand: 'Kawai', model: 'GE-1', type: 'grand', region: 'japan', size: "5' 5\"", price: 32000, color: EBONY, dimensions: { width: 149, height: 101, depth: 166 }, image: '/images/shop/piano_09.jpeg' },
  { id: 'p10', brand: 'Steinway & Sons', model: 'Model B', type: 'grand', region: 'usa', size: "6' 11\"", price: 'contact', color: EBONY, dimensions: { width: 156, height: 102, depth: 211 }, image: '/images/shop/piano_10.jpeg' },
  { id: 'p11', brand: 'Kawai', model: 'K-300', type: 'upright', region: 'japan', size: '48"', price: 24000, color: WHITE, dimensions: { width: 149, height: 122, depth: 61 }, image: '/images/shop/piano_11.jpeg' },
];
