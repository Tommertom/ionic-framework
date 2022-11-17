import { config } from './config';

let includeComponents: Map<string, boolean> | undefined;
let excludeComponents: Map<string, boolean> | undefined;

export const isIonicElement = (elm: any) => elm.tagName?.startsWith('ION-');

/**
 * This function initializes Maps for components that are
 * included or excluded from base components. This function gets called
 * for each instance of an Ionic component, so we use the Maps
 * to ensure a quick lookup time since we can avoid iterating
 * the initialize and excludes arrays each time.
 */
const initializeBaseComponentsCache = (includeCmp?: string[], excludeCmp?: string[]) => {
  /**
   * If includeCmp is defined, create a Map
   * and cache all the component tag names in it.
   */
  if (includeCmp !== undefined) {
    includeComponents = new Map();

    for (const tagName of includeCmp) {
      includeComponents.set(tagName, true);
    }
  }

  /**
   * If excludeCmp is defined, create a Map
   * and cache all the component tag names in it.
   */
  if (excludeCmp !== undefined) {
    excludeComponents = new Map();

    for (const tagName of excludeCmp) {
      excludeComponents.set(tagName, true);
    }
  }
};

/**
 * Determines if a component is
 * using base components.
 */
export const isBaseComponent = (elm: HTMLElement) => {
  /**
   * Only Ionic components can use
   * base components.
   */
  if (!isIonicElement(elm)) {
    return false;
  }

  const baseComponents = config.get('baseComponents');

  /**
   * If app has base components enabled
   * for all components then return true.
   */
  if (baseComponents === true) {
    return true;
  }

  /**
   * If app has some components opted-in
   * to base components then we need to check.
   */
  if (typeof baseComponents === 'object') {
    /**
     * Initialize the base components cache
     * if we do not already have it.
     */
    if (includeComponents === undefined && excludeComponents === undefined) {
      initializeBaseComponentsCache(baseComponents.includeComponents, baseComponents.excludeComponents);
    }

    /**
     * If component is explicitly included
     * then return true. Otherwise the
     * component should not use base components.
     */
    if (includeComponents?.has(elm.tagName.toLowerCase())) {
      return true;
    }

    /**
     * If component is explicitly included
     * then return true. Otherwise the
     * component should not use base components.
     */
    if (excludeComponents?.has(elm.tagName.toLowerCase())) {
      return true;
    }
  }

  /**
   * `baseComponents` config is either
   * set to `false` or some non-valid value.
   */
  return false;
};
