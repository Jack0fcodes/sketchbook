// Simple page flip controller
// Each .leaf equals two pages (front/back). Flipping a leaf rotates it to reveal the next leaf.

document.addEventListener('DOMContentLoaded', () => {
  const book = document.getElementById('book');
  const leaves = Array.from(book.querySelectorAll('.leaf'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicator = document.getElementById('indicator');

  // compute page counts: each leaf has 2 pages
  const totalPages = leaves.length * 2;
  let currentPage = 1; // 1-based page number (left-to-right reading)

  // update indicator (page numbers show current / total)
  function updateIndicator() {
    indicator.textContent = `${currentPage} / ${totalPages}`;
  }

  // flip forward: flips the next unflipped leaf (turn a page to the left)
  function nextPage() {
    if (currentPage >= totalPages) return;
    // flipping flips half-page increments. Determine leaf index to flip.
    // When currentPage is odd -> front side visible, flipping will reveal next page
    const leafToFlipIndex = Math.floor((currentPage) / 2);
    const leaf = leaves[leafToFlipIndex];
    if (leaf) {
      leaf.classList.add('flipped');
      // adjust z-index so flipped leaves appear behind properly
      leaf.style.zIndex = 100 - leafToFlipIndex;
      currentPage++;
      updateIndicator();
    }
  }

  // flip backward: unflip the last flipped leaf
  function prevPage() {
    if (currentPage <= 1) return;
    const leafToUnflipIndex = Math.floor((currentPage - 2) / 2);
    const leaf = leaves[leafToUnflipIndex];
    if (leaf) {
      leaf.classList.remove('flipped');
      leaf.style.zIndex = 100 - leafToUnflipIndex + 1000; // restore if needed
      currentPage--;
      updateIndicator();
    }
  }

  // wire buttons
  nextBtn.addEventListener('click', nextPage);
  prevBtn.addEventListener('click', prevPage);

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') nextPage();
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevPage();
  });

  // touch / swipe support for mobile
  let touchStartX = null;
  book.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, {passive:true});

  book.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx < -30) nextPage();
    if (dx > 30) prevPage();
    touchStartX = null;
  });

  // click on left/right half of book for navigation
  book.addEventListener('click', (e) => {
    const rect = book.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width / 2) nextPage();
    else prevPage();
  });

  // initialize indicator
  updateIndicator();

  // accessibility: announce page changes (basic)
  const live = document.createElement('div');
  live.setAttribute('aria-live','polite');
  live.style.position='absolute';
  live.style.left='-9999px';
  document.body.appendChild(live);
  const observer = new MutationObserver(()=> {
    live.textContent = `Page ${currentPage} of ${totalPages}`;
  });
  observer.observe(indicator, {childList:true, subtree:true});

});
