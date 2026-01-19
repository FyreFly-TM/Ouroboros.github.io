// Ouroboros Documentation Search
// Search index with page content and sections

const searchIndex = [
  // Index page
  { title: "Home", url: "index.html", keywords: "ouroboros home flow oriented programming language arrows data", section: "" },
  
  // Getting Started
  { title: "Getting Started", url: "getting_started.html", keywords: "getting started install setup hello world tutorial beginner", section: "" },
  { title: "Installation", url: "getting_started.html#installation", keywords: "install download setup windows linux mac", section: "Getting Started" },
  { title: "Hello World", url: "getting_started.html#hello-world", keywords: "hello world first program example", section: "Getting Started" },
  
  // Flows
  { title: "Flows", url: "flows.html", keywords: "flows function procedure subroutine method", section: "" },
  { title: "Flow Declaration", url: "flows.html#declaration", keywords: "flow declaration define create function def", section: "Flows" },
  { title: "Parameters", url: "flows.html#parameters", keywords: "parameters arguments inputs function args", section: "Flows" },
  { title: "Return Values", url: "flows.html#return-values", keywords: "return values output result", section: "Flows" },
  { title: "Multi-Return", url: "flows.html#multi-return", keywords: "multi return multiple values tuple", section: "Flows" },
  { title: "Recursion", url: "flows.html#recursion", keywords: "recursion recursive self calling", section: "Flows" },
  { title: "Flow Chaining", url: "flows.html#chaining", keywords: "chaining pipe compose chain", section: "Flows" },
  
  // Domains (ECS)
  { title: "Domains", url: "domains.html", keywords: "domains ecs entity component system", section: "" },
  { title: "Variables (.var)", url: "domains.html#variables", keywords: "variable var data structure type", section: "Domains" },
  { title: "Components (.comp)", url: "domains.html#components", keywords: "component comp ecs data", section: "Domains" },
  { title: "Entities (.ent)", url: "domains.html#entities", keywords: "entity ent ecs object", section: "Domains" },
  
  // Reference
  { title: "Reference", url: "reference.html", keywords: "reference manual documentation api", section: "" },
  { title: "Data Types", url: "reference.html#types", keywords: "types int float string bool array list number integer decimal", section: "Reference" },
  { title: "Operators", url: "reference.html#operators", keywords: "operators arithmetic comparison logical math plus minus multiply divide", section: "Reference" },
  { title: "Control Flow", url: "reference.html#control-flow", keywords: "control flow if else while for loop iteration condition branch", section: "Reference" },
  { title: "Variables", url: "reference.html#variables", keywords: "variables assignment declaration const constant", section: "Reference" },
  
  // Control Flow - Loops
  { title: "For Loop", url: "reference.html#control-flow", keywords: "for loop iteration iterate counter range repeat", section: "Reference" },
  { title: "While Loop", url: "reference.html#control-flow", keywords: "while loop iteration condition repeat until", section: "Reference" },
  { title: "Loop Break", url: "reference.html#control-flow", keywords: "break loop exit stop terminate", section: "Reference" },
  { title: "Loop Continue", url: "reference.html#control-flow", keywords: "continue loop skip next iteration", section: "Reference" },
  
  // Control Flow - Conditionals
  { title: "If Statement", url: "reference.html#control-flow", keywords: "if statement condition conditional branch", section: "Reference" },
  { title: "Else Statement", url: "reference.html#control-flow", keywords: "else statement condition conditional alternative", section: "Reference" },
  { title: "Else If", url: "reference.html#control-flow", keywords: "else if elif elseif condition chain", section: "Reference" },
  
  // Operators
  { title: "Assignment (=)", url: "reference.html#operators", keywords: "assignment equals set value variable", section: "Reference" },
  { title: "Constant Assignment (=:)", url: "reference.html#operators", keywords: "constant assignment immutable readonly =:", section: "Reference" },
  { title: "Addition (+)", url: "reference.html#operators", keywords: "addition plus add sum +", section: "Reference" },
  { title: "Subtraction (-)", url: "reference.html#operators", keywords: "subtraction minus subtract difference -", section: "Reference" },
  { title: "Multiplication (*)", url: "reference.html#operators", keywords: "multiplication multiply times product *", section: "Reference" },
  { title: "Division (/)", url: "reference.html#operators", keywords: "division divide quotient /", section: "Reference" },
  { title: "Modulo (%)", url: "reference.html#operators", keywords: "modulo modulus remainder mod %", section: "Reference" },
  { title: "Compound Assignment (+=, -=)", url: "reference.html#operators", keywords: "compound assignment += -= *= /= increment decrement", section: "Reference" },
  { title: "Comparison (==, !=, <, >)", url: "reference.html#operators", keywords: "comparison equals not equal less than greater than == != < > <= >=", section: "Reference" },
  { title: "Logical AND (&)", url: "reference.html#operators", keywords: "logical and & && ampersand condition", section: "Reference" },
  { title: "Logical OR (|)", url: "reference.html#operators", keywords: "logical or | || pipe condition", section: "Reference" },
  { title: "Logical NOT (!)", url: "reference.html#operators", keywords: "logical not ! negation negate invert", section: "Reference" },
  
  // REX & AOT
  { title: "REX & AOT", url: "rex_aot.html", keywords: "rex aot rhombille execution engine ahead of time compile bytecode vm", section: "" },
  { title: "Performance", url: "rex_aot.html#performance", keywords: "performance benchmark speed fast optimization", section: "REX & AOT" },
  { title: "Bytecode", url: "rex_aot.html#bytecode", keywords: "bytecode opcodes instructions vm virtual machine", section: "REX & AOT" },
  { title: "SIMD", url: "rex_aot.html#technologies", keywords: "simd avx sse vectorization parallel performance", section: "REX & AOT" },
  { title: "Compilation", url: "rex_aot.html#compilation", keywords: "compile compilation aot ahead of time", section: "REX & AOT" },
  { title: "Neural Optimization", url: "rex_aot.html#neural", keywords: "neural network machine learning optimization ai ml training", section: "REX & AOT" },
  { title: "Inlining Network", url: "rex_aot.html#neural", keywords: "inline function inlining neural network", section: "REX & AOT" },
  { title: "Loop Unrolling", url: "rex_aot.html#neural", keywords: "unroll loop optimization neural network", section: "REX & AOT" },
  { title: "Vectorization", url: "rex_aot.html#neural", keywords: "vectorize simd neural network optimization", section: "REX & AOT" },
  { title: "Hot Path Detection", url: "rex_aot.html#neural", keywords: "hot path profiling neural network optimization", section: "REX & AOT" },
  
  // Arrows
  { title: "Arrows", url: "arrows.html", keywords: "arrows operators flow data direction", section: "" },
  { title: "Forward Arrow (->)", url: "arrows.html#forward", keywords: "forward arrow push send data flow -> right", section: "Arrows" },
  { title: "Pull Arrow (<-)", url: "arrows.html#pull", keywords: "pull arrow fetch get receive <- left", section: "Arrows" },
  { title: "Sync Arrow (<->)", url: "arrows.html#sync", keywords: "sync arrow bidirectional two way <-> synchronize", section: "Arrows" },
  { title: "Fork Arrow", url: "arrows.html#fork", keywords: "fork arrow split broadcast multiple parallel", section: "Arrows" },
  { title: "Reactive Binding", url: "arrows.html#reactive", keywords: "reactive binding automatic update dependency watch", section: "Arrows" },
  { title: "Async Arrow", url: "arrows.html#async", keywords: "async arrow asynchronous await promise", section: "Arrows" },
  { title: "Funnel Arrow", url: "arrows.html#funnel", keywords: "funnel arrow merge combine collect", section: "Arrows" },
  { title: "Gate Arrow", url: "arrows.html#gate", keywords: "gate arrow conditional filter guard", section: "Arrows" },
  { title: "If-Else with Gates", url: "arrows.html#gates", keywords: "if else conditional gate arrow pattern branch", section: "Arrows" },
  { title: "Conditional Gates", url: "arrows.html#gates", keywords: "gate condition filter route transform", section: "Arrows" },
  { title: "Gate Success/Failure (:: ||)", url: "arrows.html#gates", keywords: "gate success failure then else error handler :: ||", section: "Arrows" },
  { title: "Flow Labels", url: "flows.html#flow-labels", keywords: "flow label decorator condition action success failure :: ||", section: "Flows" },
  
  // Tokens
  { title: "Tokens", url: "tokens.html", keywords: "tokens lexer syntax grammar parsing", section: "" },
  { title: "Keywords", url: "tokens.html#keywords", keywords: "keywords reserved words flow if while for", section: "Tokens" },
  { title: "Literals", url: "tokens.html#literals", keywords: "literals numbers strings booleans true false", section: "Tokens" },
  { title: "Operators", url: "tokens.html#operators", keywords: "operators symbols punctuation", section: "Tokens" },
  { title: "Comments", url: "tokens.html#comments", keywords: "comments // /* */ documentation", section: "Tokens" },
  
  // Files
  { title: "File Types", url: "files.html", keywords: "files extensions ouro var comp ent", section: "" },
  { title: ".ouro Files", url: "files.html#ouro", keywords: "ouro main program entry point script", section: "Files" },
  { title: ".var Files", url: "files.html#var", keywords: "var variable definition data structure schema", section: "Files" },
  { title: ".comp Files", url: "files.html#comp", keywords: "comp component ecs behavior", section: "Files" },
  { title: ".ent Files", url: "files.html#ent", keywords: "ent entity ecs object instance", section: "Files" },
  
  // Standard Library
  { title: "Standard Library", url: "stdlib.html", keywords: "stdlib standard library builtin functions", section: "" },
  { title: "Print", url: "stdlib.html#print", keywords: "print output console log display write", section: "Std Lib" },
  { title: "Input", url: "stdlib.html#input", keywords: "input read console user keyboard", section: "Std Lib" },
  { title: "Math Functions", url: "stdlib.html#math", keywords: "math abs sqrt sin cos tan floor ceil round pow power", section: "Std Lib" },
  { title: "String Functions", url: "stdlib.html#strings", keywords: "string length substring concat split join trim upper lower", section: "Std Lib" },
  { title: "Array Functions", url: "stdlib.html#arrays", keywords: "array list length push pop append remove insert sort", section: "Std Lib" },
  { title: "File I/O", url: "stdlib.html#file-io", keywords: "file read write open close io input output", section: "Std Lib" },
  { title: "Sleep", url: "stdlib.html#sleep", keywords: "sleep wait delay pause timer timeout", section: "Std Lib" },
  { title: "Random", url: "stdlib.html#random", keywords: "random rand number generate", section: "Std Lib" },
  { title: "Time", url: "stdlib.html#time", keywords: "time date now clock timestamp", section: "Std Lib" },
  { title: "Type Conversion", url: "stdlib.html#conversion", keywords: "type conversion cast int string float tostring toint", section: "Std Lib" },
  
  // Windows
  { title: "Windowing System", url: "windows.html", keywords: "window gui graphics ui interface native", section: "" },
  { title: "Quick Start", url: "windows.html#quick-start", keywords: "quick start window create show tutorial", section: "Windows" },
  { title: "Idiomatic Patterns", url: "windows.html#idiomatic-patterns", keywords: "idiomatic patterns best practices syntax for loop constant", section: "Windows" },
  { title: "Window Management", url: "windows.html#window-management", keywords: "window create show hide close resize move", section: "Windows" },
  { title: "WindowCreate", url: "windows.html#window-management", keywords: "windowcreate create new window", section: "Windows" },
  { title: "WindowShow", url: "windows.html#window-management", keywords: "windowshow show display visible", section: "Windows" },
  { title: "WindowHide", url: "windows.html#window-management", keywords: "windowhide hide invisible", section: "Windows" },
  { title: "WindowClose", url: "windows.html#window-management", keywords: "windowclose close destroy", section: "Windows" },
  { title: "WindowSetTitle", url: "windows.html#window-management", keywords: "windowsettitle title caption", section: "Windows" },
  { title: "Drawing Primitives", url: "windows.html#drawing-primitives", keywords: "draw rect circle line text graphics render paint", section: "Windows" },
  { title: "WindowDrawRect", url: "windows.html#drawing-primitives", keywords: "windowdrawrect rectangle draw shape box", section: "Windows" },
  { title: "WindowDrawRoundedRect", url: "windows.html#drawing-primitives", keywords: "windowdrawroundedrect rounded rectangle corners", section: "Windows" },
  { title: "WindowDrawCircle", url: "windows.html#drawing-primitives", keywords: "windowdrawcircle circle draw ellipse", section: "Windows" },
  { title: "WindowDrawLine", url: "windows.html#drawing-primitives", keywords: "windowdrawline line draw stroke", section: "Windows" },
  { title: "WindowDrawText", url: "windows.html#drawing-primitives", keywords: "windowdrawtext text font render label", section: "Windows" },
  { title: "WindowClear", url: "windows.html#drawing-primitives", keywords: "windowclear clear background erase", section: "Windows" },
  { title: "Colors", url: "windows.html#colors", keywords: "color rgb hex red green blue alpha", section: "Windows" },
  { title: "Mouse Input", url: "windows.html#mouse-input", keywords: "mouse input click position button cursor", section: "Windows" },
  { title: "WindowGetMouseX/Y", url: "windows.html#mouse-input", keywords: "windowgetmousex windowgetmousey mouse position coordinates", section: "Windows" },
  { title: "WindowMouseClicked", url: "windows.html#mouse-input", keywords: "windowmouseclicked mouse click button pressed", section: "Windows" },
  { title: "WindowMouseDown", url: "windows.html#mouse-input", keywords: "windowmousedown mouse button held down", section: "Windows" },
  { title: "WindowMouseInRect", url: "windows.html#mouse-input", keywords: "windowmouseinrect hit test bounds hover", section: "Windows" },
  { title: "Keyboard Input", url: "windows.html#keyboard-input", keywords: "keyboard input key press keydown keyup", section: "Windows" },
  { title: "WindowKeyPressed", url: "windows.html#keyboard-input", keywords: "windowkeypressed key pressed down", section: "Windows" },
  { title: "WindowGetKey", url: "windows.html#keyboard-input", keywords: "windowgetkey key input", section: "Windows" },
  { title: "Double Buffering", url: "windows.html#double-buffering", keywords: "double buffering flicker render refresh vsync smooth", section: "Windows" },
  { title: "WindowSwap", url: "windows.html#double-buffering", keywords: "windowswap swap buffers present", section: "Windows" },
  { title: "Anchor System", url: "windows.html#anchor-system", keywords: "anchor responsive resize scale ui layout position", section: "Windows" },
  { title: "Building UI Library", url: "windows.html#building-ui-library", keywords: "ui library component button widget custom", section: "Windows" },
  { title: "Buttons", url: "windows.html#building-ui-library", keywords: "button click ui widget interactive", section: "Windows" },
  { title: "Interactive Example", url: "windows.html#interactive-example", keywords: "interactive example demo button click game", section: "Windows" },
  { title: "Game Loop", url: "windows.html#game-loop", keywords: "game loop update render frame tick", section: "Windows" },
  
  // Examples
  { title: "Examples", url: "examples.html", keywords: "examples demos sample code tutorial", section: "" },
  { title: "Hello World Example", url: "examples.html#hello-world", keywords: "hello world example simple basic", section: "Examples" },
  { title: "Fibonacci Example", url: "examples.html#fibonacci", keywords: "fibonacci example recursion math", section: "Examples" },
  { title: "Counter Example", url: "examples.html#counter", keywords: "counter example increment variable", section: "Examples" },
  
  // Downloads
  { title: "Downloads", url: "downloads.html", keywords: "download install release binary executable version", section: "" },
  
  // Common searches
  { title: "How to print", url: "stdlib.html#print", keywords: "how to print output display text console", section: "Std Lib" },
  { title: "How to create a loop", url: "reference.html#control-flow", keywords: "how to create loop for while iterate repeat", section: "Reference" },
  { title: "How to create a function", url: "flows.html#declaration", keywords: "how to create function flow define method", section: "Flows" },
  { title: "How to create a window", url: "windows.html#quick-start", keywords: "how to create window gui graphics", section: "Windows" },
  { title: "How to draw", url: "windows.html#drawing-primitives", keywords: "how to draw graphics render paint", section: "Windows" },
  { title: "How to get input", url: "stdlib.html#input", keywords: "how to get input user keyboard read", section: "Std Lib" },
  { title: "How to use arrays", url: "stdlib.html#arrays", keywords: "how to use arrays list collection", section: "Std Lib" },
  { title: "How to use strings", url: "stdlib.html#strings", keywords: "how to use strings text", section: "Std Lib" },
];

// Search state
let searchResults = [];
let selectedIndex = -1;

// Initialize search
function initSearch() {
  const searchInput = document.getElementById('doc-search');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;
  
  // Input event
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) {
      hideResults();
      return;
    }
    performSearch(query);
  });
  
  // Focus event
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2) {
      showResults();
    }
  });
  
  // Keyboard navigation
  searchInput.addEventListener('keydown', (e) => {
    const items = document.querySelectorAll('.search-result-item');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      updateSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        items[selectedIndex].click();
      }
    } else if (e.key === 'Escape') {
      hideResults();
      searchInput.blur();
    }
  });
  
  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      hideResults();
    }
  });
}

function performSearch(query) {
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);
  
  // Score and filter results
  const scored = searchIndex.map(item => {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const keywordsLower = item.keywords.toLowerCase();
    
    // Exact title match
    if (titleLower === queryLower) score += 100;
    // Title starts with query
    else if (titleLower.startsWith(queryLower)) score += 50;
    // Title contains query
    else if (titleLower.includes(queryLower)) score += 30;
    
    // Check each word
    words.forEach(word => {
      if (titleLower.includes(word)) score += 20;
      if (keywordsLower.includes(word)) score += 10;
    });
    
    return { ...item, score };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  displayResults(scored, query);
}

function displayResults(results, query) {
  const container = document.getElementById('search-results');
  if (!container) return;
  
  selectedIndex = -1;
  
  if (results.length === 0) {
    container.innerHTML = '<div class="search-no-results">No results found</div>';
    showResults();
    return;
  }
  
  const html = results.map((item, index) => {
    const sectionBadge = item.section ? `<span class="search-section">${item.section}</span>` : '';
    return `
      <a href="${item.url}" class="search-result-item" data-index="${index}">
        <div class="search-result-title">${highlightMatch(item.title, query)}</div>
        ${sectionBadge}
      </a>
    `;
  }).join('');
  
  container.innerHTML = html;
  showResults();
}

function highlightMatch(text, query) {
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function updateSelection(items) {
  items.forEach((item, i) => {
    item.classList.toggle('selected', i === selectedIndex);
  });
  
  if (selectedIndex >= 0 && items[selectedIndex]) {
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }
}

function showResults() {
  const container = document.getElementById('search-results');
  if (container) container.classList.add('visible');
}

function hideResults() {
  const container = document.getElementById('search-results');
  if (container) container.classList.remove('visible');
  selectedIndex = -1;
}

// ============================================
// Page Loading Screen
// ============================================

function createLoader() {
  // Don't create if already exists
  if (document.getElementById('page-loader')) return;
  
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.innerHTML = `
    <div class="loader-spinner"></div>
    <div class="loader-text">Loading...</div>
    <div class="loader-progress">
      <div class="loader-progress-bar"></div>
    </div>
  `;
  document.body.appendChild(loader);
}

function showLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('active');
    // Start progress animation
    const progressBar = loader.querySelector('.loader-progress-bar');
    if (progressBar) {
      progressBar.style.width = '0%';
      // Animate to ~80% quickly, then slow down (simulates real loading)
      setTimeout(() => progressBar.style.width = '30%', 50);
      setTimeout(() => progressBar.style.width = '60%', 150);
      setTimeout(() => progressBar.style.width = '80%', 300);
      // Slow crawl after 80% until page actually loads
      setTimeout(() => progressBar.style.width = '90%', 600);
      setTimeout(() => progressBar.style.width = '95%', 1200);
    }
  }
}

function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    const progressBar = loader.querySelector('.loader-progress-bar');
    if (progressBar) progressBar.style.width = '100%';
    setTimeout(() => loader.classList.remove('active'), 100);
  }
}

function initPageLoader() {
  createLoader();
  
  // Show loader on navigation link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Skip if it's an anchor link on the same page
    if (href.startsWith('#')) return;
    
    // Skip if it's an external link
    if (href.startsWith('http://') || href.startsWith('https://')) return;
    
    // Skip if modifier keys are pressed (new tab, etc.)
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;
    
    // Skip if it's a download link
    if (link.hasAttribute('download')) return;
    
    // Skip if target is _blank
    if (link.getAttribute('target') === '_blank') return;
    
    // Show the loader
    showLoader();
  });
  
  // Hide loader when page is fully loaded (for back/forward navigation)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      // Page was restored from bfcache
      hideLoader();
    }
  });
}

// Global keyboard shortcut (Ctrl+K or Cmd+K to focus search)
function initGlobalShortcut() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+K (Windows/Linux) or Cmd+K (Mac)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('doc-search');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initGlobalShortcut();
  initPageLoader();
});

// Also init if script loads after DOM
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initSearch();
  initGlobalShortcut();
  initPageLoader();
}
