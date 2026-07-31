// Concert types.
//
// Concert content now lives in D1 (see src/lib/content.ts) and is managed
// through the admin CMS; this module only defines the shared shape of a concert
// used across the concerts page and the editor.

export interface LocalizedText {
  en: string;
  he: string;
}

export interface Concert {
  id: string;
  name: LocalizedText;
  poster: string;
  /** ISO date (yyyy-mm-dd), used for sorting and display. */
  date: string;
  /** Start time, e.g. "20:30". */
  time: string;
  venue: LocalizedText;
  /** Ticket price in ILS. */
  price: number;
  /** Short, tempting blurb about the artist and the performance. */
  description?: LocalizedText;
  /** Optional performer list (free text per language). */
  artists?: LocalizedText;
  /** DB id of the poster image (admin edit). */
  posterId?: number;
  /** Draft flag — hidden from the public list when false. */
  published?: boolean;
}
