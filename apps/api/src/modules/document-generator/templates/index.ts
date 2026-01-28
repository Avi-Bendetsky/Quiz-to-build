/**
 * Document Templates Index
 *
 * Exports all document template configurations for use by the document generator.
 */

export * from './base.template';
export * from './technology-roadmap.template';
export * from './business-plan.template';

/**
 * Registry of all available document templates by slug
 */
export const TEMPLATE_REGISTRY = {
  'technology-roadmap': () =>
    import('./technology-roadmap.template').then((m) => m.TECHNOLOGY_ROADMAP_TEMPLATE),
  'business-plan': () => import('./business-plan.template').then((m) => m.BUSINESS_PLAN_TEMPLATE),
} as const;

export type TemplateSlug = keyof typeof TEMPLATE_REGISTRY;
