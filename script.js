function setTimelineArrowDirection(isRTL) {
  const leftBtn = document.getElementById('arrow-left');
  const rightBtn = document.getElementById('arrow-right');
  const leftIcon = document.getElementById('arrow-left-icon');
  const rightIcon = document.getElementById('arrow-right-icon');
  if (!leftBtn || !rightBtn || !leftIcon || !rightIcon) return;

  // Remove all icon classes first
  leftIcon.className = 'bi';
  rightIcon.className = 'bi';

  if (isRTL) {
    leftIcon.classList.add('bi-chevron-right');
    rightIcon.classList.add('bi-chevron-left');
    leftBtn.onclick = function() { scrollTimeline(1); };
    rightBtn.onclick = function() { scrollTimeline(-1); };
  } else {
    leftIcon.classList.add('bi-chevron-left');
    rightIcon.classList.add('bi-chevron-right');
    leftBtn.onclick = function() { scrollTimeline(-1); };
    rightBtn.onclick = function() { scrollTimeline(1); };
  }
}

function scrollTimeline(direction) {
  const timeline = document.querySelector('.timeline');
  const milestones = document.querySelectorAll('.milestone');
  if (!timeline || milestones.length === 0) return;
  const style = getComputedStyle(milestones[0]);
  const width = milestones[0].offsetWidth;
  const margin = parseInt(style.marginLeft) + parseInt(style.marginRight);
  const scrollAmount = width + margin;
  timeline.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

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

  // Update timeline arrows and direction
  setTimelineArrowDirection(isRTL);
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

// Loading overlay hide logic
window.addEventListener('load', function() {
  const overlay = document.getElementById('page-loading-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.display = 'none', 300);
  }
});

// Timeline navigation and accessibility logic (only runs if timeline exists)
document.addEventListener('DOMContentLoaded', function() {
  const timeline = document.querySelector('.timeline');
  const milestones = document.querySelectorAll('.milestone');
  const leftBtn = document.getElementById('arrow-left');
  const rightBtn = document.getElementById('arrow-right');

  if (!timeline || milestones.length === 0) return;

  // Find the width of one milestone (including margin)
  function getMilestoneWidth() {
    if (milestones.length === 0) return 300;
    const style = getComputedStyle(milestones[0]);
    const width = milestones[0].offsetWidth;
    const margin = parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width + margin;
  }

  // Scroll left by one milestone
  if (leftBtn) {
    leftBtn.onclick = function() {
      timeline.scrollBy({ left: -getMilestoneWidth(), behavior: 'smooth' });
    };
  }

  // Scroll right by one milestone
  if (rightBtn) {
    rightBtn.onclick = function() {
      timeline.scrollBy({ left: getMilestoneWidth(), behavior: 'smooth' });
    };
  }

  // Track the currently focused milestone index
  let focusedIndex = 0;

  // Helper to focus a milestone by index
  function focusMilestone(idx) {
    if (milestones.length === 0) return;
    // Clamp index
    focusedIndex = Math.max(0, Math.min(idx, milestones.length - 1));
    milestones[focusedIndex].focus();
    milestones[focusedIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  // Make milestones only programmatically focusable (not tabbable)
  milestones.forEach(m => m.setAttribute('tabindex', '-1'));

  // Keyboard navigation for timeline
  timeline.addEventListener('keydown', function(e) {
    // Detect current direction
    const isRTL = document.documentElement.dir === 'rtl';
    if (e.key === 'ArrowLeft') {
      if (isRTL) {
        // ArrowLeft means scroll right in RTL
        if (focusedIndex < milestones.length - 1) {
          focusMilestone(focusedIndex + 1);
        } else {
          document.getElementById('arrow-right')?.click();
        }
      } else {
        if (focusedIndex > 0) {
          focusMilestone(focusedIndex - 1);
        } else {
          document.getElementById('arrow-left')?.click();
        }
      }
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      if (isRTL) {
        // ArrowRight means scroll left in RTL
        if (focusedIndex > 0) {
          focusMilestone(focusedIndex - 1);
        } else {
          document.getElementById('arrow-left')?.click();
        }
      } else {
        if (focusedIndex < milestones.length - 1) {
          focusMilestone(focusedIndex + 1);
        } else {
          document.getElementById('arrow-right')?.click();
        }
      }
      e.preventDefault();
    }
    // Do not handle Tab here; handled on milestone elements
  });

  // Keep only the focus tracking for mouse/programmatic focus
  milestones.forEach((m, idx) => {
    m.addEventListener('focus', () => { focusedIndex = idx; });
  });
});

