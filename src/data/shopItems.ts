// Shop inventory.
//
// This is intentionally a plain, flat array so it can later be replaced by a
// CMS / database source without touching the gallery layout: the store page
// renders whatever items live here (any amount), assigning the editorial tile
// sizes purely by position. To add an item, append an object with a unique id.

export type ShopType = 'grand' | 'upright';
export type ShopRegion = 'japan' | 'europe' | 'usa';

export interface ShopItem {
  id: string;
  brand: string;
  model: string;
  type: ShopType;
  /** Origin region, used as a store filter facet. */
  region: ShopRegion;
  /** Length for grands / height for uprights, shown next to the model. */
  size: string;
  /** ILS price, or 'contact' when priced on request */
  price: number | 'contact';
  image: string;
}

export const shopItems: ShopItem[] = [
  { id: 'p1', brand: 'Grotrian-Steinweg', model: 'Concert 132', type: 'upright', region: 'europe', size: '52"', price: 28000, image: '/assets/shop/piano_01.jpeg' },
  { id: 'p2', brand: 'Steinway & Sons', model: 'Model D Artcase', type: 'grand', region: 'usa', size: '8\' 11¾"', price: 'contact', image: '/assets/shop/piano_02.jpeg' },
  { id: 'p3', brand: 'Anderson', model: 'Parlor Grand', type: 'grand', region: 'usa', size: '5\' 4"', price: 22000, image: '/assets/shop/piano_03.jpeg' },
  { id: 'p4', brand: 'Yamaha', model: 'U1', type: 'upright', region: 'japan', size: '48"', price: 18500, image: '/assets/shop/piano_04.jpeg' },
  { id: 'p5', brand: 'Bösendorfer', model: 'Model 200', type: 'grand', region: 'europe', size: '6\' 7"', price: 'contact', image: '/assets/shop/piano_05.jpeg' },
  { id: 'p6', brand: 'Bösendorfer', model: 'Model 214 Mahogany', type: 'grand', region: 'europe', size: '7\' 0"', price: 'contact', image: '/assets/shop/piano_06.webp' },
  { id: 'p7', brand: 'Bösendorfer', model: 'Model 170', type: 'grand', region: 'europe', size: '5\' 8"', price: 'contact', image: '/assets/shop/piano_07.jpeg' },
  { id: 'p8', brand: 'Blüthner', model: 'Model 11', type: 'grand', region: 'europe', size: '5\' 1"', price: 45000, image: '/assets/shop/piano_08.jpeg' },
  { id: 'p9', brand: 'Kawai', model: 'GE-1', type: 'grand', region: 'japan', size: '5\' 5"', price: 32000, image: '/assets/shop/piano_09.jpeg' },
  { id: 'p10', brand: 'Steinway & Sons', model: 'Model B', type: 'grand', region: 'usa', size: '6\' 11"', price: 'contact', image: '/assets/shop/piano_10.jpeg' },
  { id: 'p11', brand: 'Kawai', model: 'K-300', type: 'upright', region: 'japan', size: '48"', price: 24000, image: '/assets/shop/piano_11.jpeg' },
];
