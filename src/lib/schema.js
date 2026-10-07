// Shared JSON-LD builders.
//
// Centralizes the site identity facts (name, jobTitle, canonical URLs) that
// were previously hand-duplicated inline on individual pages, so schema
// stays consistent instead of drifting page to page. Keep this file limited
// to builders; page-specific content (offers, descriptions, FAQ copy) is
// still supplied by the calling page.

export const SITE_URL = 'https://opendoorlearningai.com';
export const PERSON_NAME = 'Jonathan Malkin';
// Decided 2026-10-05 with the Open Door Learning revamp (PRODUCT.md). "AI
// consultant", "Knowledge Systems Builder", "Operating Partner" and
// fractional-led titles are retired; this is the one jobTitle used everywhere.
export const JOB_TITLE = 'AI Educator and Builder';
export const ORG_NAME = 'Open Door Learning';
export const PERSON_ID = `${SITE_URL}/#jonathan-malkin`;
export const ORG_ID = `${SITE_URL}/#open-door-learning`;

const DEFAULT_SAME_AS = [
  'https://github.com/jonathanmalkin',
  'https://x.com/builtwithjon',
  'https://www.linkedin.com/in/jonathanmalkin',
];

/**
 * @param {{ description: string, url?: string, sameAs?: string[] } & Record<string, unknown>} options
 *   Extra keys (e.g. knowsAbout) pass through onto the returned schema object.
 */
// One list for every page, so the same @id never carries different facts.
const DEFAULT_KNOWS_ABOUT = [
  'AI workshops for business owners',
  'AI training for executives and teams',
  'applied AI in small business',
  'organizing business knowledge for AI',
  'personal AI assistants',
  'enterprise technology adoption',
];

export function buildPersonSchema({ description, url = `${SITE_URL}/about/`, sameAs = DEFAULT_SAME_AS, knowsAbout = DEFAULT_KNOWS_ABOUT, ...extra } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON_NAME,
    jobTitle: JOB_TITLE,
    worksFor: { '@type': 'Organization', '@id': ORG_ID, name: ORG_NAME, url: SITE_URL },
    description,
    url,
    sameAs,
    knowsAbout,
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
  name = ORG_NAME,
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
    '@id': ORG_ID,
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
