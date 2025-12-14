import { loadTableOfContents } from './components/toc.js';
import { setupKatex } from './lib/katex-config.js';
import { loadFooter } from './components/footer.js';
import { loadReferences } from './pages/references.js';

document.addEventListener("DOMContentLoaded", () => {
    setupKatex();
    loadTableOfContents(); 
    loadFooter();
    loadReferences();
});