import { loadTableOfContents } from './components/toc.js';
import { setupKatex } from './lib/katex-config.js';
import { loadFooter } from './components/footer.js';
import { loadReferences } from './pages/references.js';
import { makeAlgorithm } from './pages/algorithm.js';
import { makeArticle } from './pages/article.js';

document.addEventListener("DOMContentLoaded", () => {
    setupKatex();
    loadTableOfContents(); 
    loadFooter();
    loadReferences();
    makeAlgorithm();    
    makeArticle();
});