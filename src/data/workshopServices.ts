// Workshop service types.
//
// Workshop content now lives in D1 (see src/lib/content.ts) and is managed
// through the admin CMS; this module only defines the shared shapes used across
// the workshop pages and the editor.

export interface LocalizedText {
  en: string;
  he: string;
  ar?: string;
  ru?: string;
}

export interface WorkshopService {
  id: string;
  name: LocalizedText;
  /** One-line description of the fix. */
  description: LocalizedText;
}

export interface WorkshopCategory {
  id: string;
  name: LocalizedText;
  /** Short tagline shown under the title. */
  description: LocalizedText;
  /** Optional longer introductory paragraph shown above the fixes list. */
  intro?: LocalizedText;
  /** Primary image (tile + gallery fallback). */
  image: string;
  /** Optional extra images for the detail-page gallery/carousel. */
  images?: string[];
  /** DB id of the primary image (admin edit). */
  imageId?: number;
  /** Gallery images with ids (admin edit; first is the tile/main image). */
  galleryImages?: { id: number; url: string }[];
  services: WorkshopService[];
}
