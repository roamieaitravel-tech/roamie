## 2025-05-15 - Premium Design & Global Localization
**Learning:** The brand identity for this application requires a "Premium AI" feel, which excludes the use of emojis in favor of Lucide icons and professional typography. Additionally, to project an international presence, hardcoded localizations to specific regions (e.g., West Bengal, India) should be avoided in public-facing marketing copy.
**Action:** Replace emojis with Lucide icons in landing components. Use generic or globally diverse location examples (London, Tokyo) in onboarding and demos.

## 2025-05-15 - Accessibility for Icon-Only Navigation
**Learning:** Icon-only buttons (mobile menu toggles, social links) are frequently used in the premium layout but are inaccessible to screen readers without explicit labeling.
**Action:** Always include `aria-label` or `sr-only` text for any interactive element that does not have visible text.
