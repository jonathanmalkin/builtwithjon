// Shared JSON-LD builders.
//
// Centralizes the site identity facts (name, jobTitle, canonical URLs) that
// were previously hand-duplicated inline on individual pages, so schema
// stays consistent instead of drifting page to page. Keep this file limited
// to builders; page-specific content (offers, descriptions, FAQ copy) is
// still supplied by the calling page.

export const SITE_URL = 'https://builtwithjon.com';
export const PERSON_NAME = 'Jonathan Malkin';
// Decided 2026-08-15 with the company-brain positioning. "AI consultant",
// "Operating Partner", and fractional-led titles are retired; this is the one
// jobTitle used everywhere.
export const JOB_TITLE = 'Knowledge Systems Builder';

const DEFAULT_SAME_AS = [
  'https://github.com/jonathanmalkin',
  'https://x.com/builtwithjon',
  'https://linkedin.com/in/jonathanmalkin',
];

/**
 * @param {{ description: string, url?: string, sameAs?: string[] } & Record<string, unknown>} options
 *   Extra keys (e.g. knowsAbout) pass through onto the returned schema object.
 */
export function buildPersonSchema({ description, url = `${SITE_URL}/about/`, sameAs = DEFAULT_SAME_AS, ...extra } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PERSON_NAME,
    jobTitle: JOB_TITLE,
    description,
    url,
    sameAs,
    ...extra,
  };
}

/**
 * @param {{
 *   name?: string,
 *   url?: string,
 *   description: string,
 *   founder?: Record<string, unknown>,
 *   address?: Record<string, unknown>,
 *   makesOffer?: Record<string, unknown>[],
 * }} options
 */
export function buildProfessionalServiceSchema({
  name = 'Built with Jon',
  url = SITE_URL,
  description,
  founder,
  address = {
    '@type': 'PostalAddress',
    addressLocality: 'Austin',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  makesOffer = [],
} = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name,
    url,
    description,
    ...(founder ? { founder } : {}),
    address,
    ...(makesOffer.length ? { makesOffer } : {}),
  };
}

/**
 * @param {{ question: string, answer: string }[]} questions
 */
export function buildFaqPageSchema(questions = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}
