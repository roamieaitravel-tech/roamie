## 2025-04-17 - [Accessibility: ARIA Labels for Icon Buttons]
**Learning:** Icon-only buttons (like password visibility toggles) are common in this app's auth forms but lacked accessible labels, making them unusable for screen reader users.
**Action:** Always ensure interactive elements with no text content have descriptive `aria-label` attributes.
