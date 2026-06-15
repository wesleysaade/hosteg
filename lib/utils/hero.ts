import { fetchPageSection } from './content'

export interface HeroData {
  badge:    string
  title:    string
  subtitle: string
  desc:     string
  ctaLabel: string
  ctaHref:  string
}

/** Fetches hero content from DB, falls back to provided defaults for empty fields. */
export async function getHero(pageSlug: string, defaults: Partial<HeroData>): Promise<HeroData> {
  const db = await fetchPageSection(pageSlug, 'hero')
  return {
    badge:    db?.badge     || defaults.badge    || '',
    title:    db?.title     || defaults.title    || '',
    subtitle: db?.subtitle  || defaults.subtitle || '',
    desc:     db?.desc      || defaults.desc     || '',
    ctaLabel: db?.cta_label || defaults.ctaLabel || '',
    ctaHref:  db?.cta_href  || defaults.ctaHref  || '',
  }
}
