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

// Load the BCA-inspired coding visuals without changing the existing portfolio sections.
const codingStyles = document.createElement('link');
codingStyles.rel = 'stylesheet';
codingStyles.href = 'coding.css';
document.head.append(codingStyles);

const codingNavLink = document.createElement('a');
codingNavLink.href = '#coding';
codingNavLink.textContent = 'Coding';
navigation?.insertBefore(codingNavLink, navigation.querySelector('.nav-cta'));

const codingSection = document.createElement('section');
codingSection.className = 'coding-section section-pad';
codingSection.id = 'coding';
codingSection.innerHTML = `
  <div class="section-wrap coding-layout">
    <div class="coding-intro reveal">
      <p class="eyebrow"><span class="code-eyebrow-icon" aria-hidden="true">&lt;/&gt;</span> MY BCA · MY CODE JOURNEY</p>
      <h2>Curiosity, meet<br><em>code.</em></h2>
      <p class="coding-description">As a BCA student, I’m exploring how ideas turn into websites and useful digital experiences. I’m at the beginning of my coding journey—and excited to keep learning, experimenting, and creating.</p>
      <div class="coding-topics" aria-label="Coding topics to explore">
        <span><b>01</b> HTML · page structure</span>
        <span><b>02</b> CSS · visual design</span>
        <span><b>03</b> JavaScript · interactivity</span>
      </div>
      <p class="coding-note"><span class="coding-live-dot"></span> Learning in progress — one line at a time</p>
    </div>
    <div class="code-window reveal" aria-label="Decorative code editor showing an example portfolio card">
      <div class="editor-topbar"><div class="editor-dots" aria-hidden="true"><i></i><i></i><i></i></div><span class="editor-filename"><span aria-hidden="true">◈</span> bilkis-card.html</span><span class="editor-language">HTML</span></div>
      <div class="editor-body"><div class="editor-lines" aria-hidden="true"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div><pre><code><span class="code-comment">&lt;!-- My next chapter --&gt;</span>
<span class="code-pink">&lt;article</span> <span class="code-green">class</span>=<span class="code-yellow">"bca-student"</span><span class="code-pink">&gt;</span>
  <span class="code-pink">&lt;h2&gt;</span>Hello, world!<span class="code-pink">&lt;/h2&gt;</span>
  <span class="code-pink">&lt;p&gt;</span>
    BCA student at KKSOU
    <span class="code-blue">and always learning.</span>
  <span class="code-pink">&lt;/p&gt;</span>
  <span class="code-pink">&lt;a</span> <span class="code-green">href</span>=<span class="code-yellow">"#coding"</span><span class="code-pink">&gt;</span>Explore<span class="code-pink">&lt;/a&gt;</span>
<span class="code-pink">&lt;/article&gt;</span></code></pre></div>
      <div class="editor-footer"><span><span aria-hidden="true">●</span> Ready to learn</span><span>UTF-8&nbsp; · &nbsp;HTML</span></div>
      <span class="code-sticker" aria-hidden="true">{ curious<br>&nbsp; &nbsp;: true }</span>
    </div>
  </div>`;

const skillsSection = document.querySelector('#skills');
if (skillsSection) skillsSection.parentNode.insertBefore(codingSection, skillsSection);

// Try the local photo first, then the repository's raw image URL if relative paths fail.
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
