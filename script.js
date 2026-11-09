const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isExpanded));
  menuButton.setAttribute('aria-label', isExpanded ? 'Open navigation' : 'Close navigation');
  navigation?.classList.toggle('is-open', !isExpanded);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  });
});

// Reveal the hero title one character at a time while keeping it accessible.
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
  heroTitle.classList.add('hero-title');
  heroTitle.setAttribute('aria-label', 'Hi, I’m Bilkis Parban.');
  const walker = document.createTreeWalker(heroTitle, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  let characterIndex = 0;
  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment();
    Array.from(textNode.textContent).forEach((character) => {
      if (/\s/.test(character)) {
        fragment.append(document.createTextNode(character));
        return;
      }
      const letter = document.createElement('span');
      letter.className = 'hero-letter';
      letter.setAttribute('aria-hidden', 'true');
      letter.style.setProperty('--letter-index', characterIndex++);
      letter.textContent = character;
      fragment.append(letter);
    });
    textNode.replaceWith(fragment);
  });
}

// Try the local photo first, then the repository's raw image URL if the page
// is being previewed from a location where relative image paths do not resolve.
const portrait = document.querySelector('.portrait-image img');
if (portrait) {
  const handlePortraitError = () => {
    if (!portrait.dataset.rawRetry) {
      portrait.dataset.rawRetry = 'true';
      portrait.style.display = 'block';
      portrait.src = 'https://raw.githubusercontent.com/parbinbilkis374-tech/MyPortfolio/main/MyPhoto.png';
    } else {
      portrait.style.display = 'none';
      portrait.parentElement?.classList.add('photo-missing');
    }
  };
  portrait.addEventListener('error', handlePortraitError);
  if (portrait.complete && portrait.naturalWidth === 0) handlePortraitError();
}

const animationStyles = document.createElement('style');
animationStyles.textContent = `
.hero-title .hero-letter{display:inline-block;color:inherit;font-style:inherit;opacity:0;transform:translateY(.45em) rotateX(-65deg);transform-origin:50% 100%;animation:hero-letter-in .48s cubic-bezier(.2,.75,.25,1) forwards;animation-delay:calc(var(--letter-index)*55ms);animation-play-state:paused}
.hero-copy.is-visible .hero-title .hero-letter{animation-play-state:running}
@keyframes hero-letter-in{to{opacity:1;transform:translateY(0) rotateX(0)}}
.portrait-image img{display:block;position:absolute;z-index:2;inset:0;width:100%;height:100%;object-fit:contain;object-position:center bottom}
.portrait-image.photo-missing .photo-fallback{position:relative;z-index:1}
@media(prefers-reduced-motion:reduce){.hero-title .hero-letter{opacity:1;transform:none;animation:none}}
`;
document.head.append(animationStyles);

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
