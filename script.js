function toggleBootstrapRTLSupport() {
  // Try getting the language set on the HTML tag; if not available, get it from the navigator.
  let currentLang = document.documentElement.lang || navigator.language || navigator.userLanguage;
  // Get a two-letter language code
  let langCode = currentLang.slice(0, 2).toLowerCase();

  // Define languages that require RTL support
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  const isRTL = rtlLanguages.indexOf(langCode) > -1;

  // Set the document direction based on whether it's RTL or not.
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

  // Check if the Bootstrap RTL stylesheet is already present.
  let bootstrapRTLLink = document.getElementById('bootstrap-rtl');

  if (isRTL) {
    // If the language is RTL and the RTL stylesheet hasn’t been loaded, add it.
    if (!bootstrapRTLLink) {
      bootstrapRTLLink = document.createElement('link');
      bootstrapRTLLink.id = 'bootstrap-rtl';
      bootstrapRTLLink.rel = 'stylesheet';
      // Modify this URL to match your Bootstrap RTL stylesheet location.
      bootstrapRTLLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.rtl.min.css';
      document.head.appendChild(bootstrapRTLLink);
    }
  } else {
    // If the language is left-to-right (LTR) and the RTL stylesheet exists, remove it.
    if (bootstrapRTLLink) {
      bootstrapRTLLink.remove();
    }
  }
}

// Initialize RTL detection when the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", toggleBootstrapRTLSupport);

// Optionally, if your application allows dynamic language switching,
// you can observe changes to the HTML element’s "lang" attribute.
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.attributeName === 'lang') {
      toggleBootstrapRTLSupport();
    }
  }
});

observer.observe(document.documentElement, { attributes: true });

