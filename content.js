function addImageSizeOverlays() {
  const resourceEntries = performance.getEntriesByType('resource');
  const resourceMap = new Map();

  resourceEntries.forEach(entry => {
    if (entry.initiatorType === 'img') {
      resourceMap.set(entry.name, entry);
    }
  });

  // Clean up previous wrappers and restore images to original parents
  document.querySelectorAll('.image-size-overlay-wrapper').forEach(wrapper => {
    const img = wrapper.querySelector('img');
    if (img) {
      wrapper.parentNode.insertBefore(img, wrapper);
      img.style.position = '';
    }
    wrapper.remove();
  });

  function createOverlay(text, bgColor) {
    const overlay = document.createElement('div');
    overlay.textContent = text;
    overlay.style.position = 'absolute';
    overlay.style.width = 'max-content';
    overlay.style.background = bgColor;
    overlay.style.color = 'white';
    overlay.style.fontSize = '10px';
    overlay.style.fontWeight = 'bold';
    overlay.style.padding = '4px 8px';
    overlay.style.pointerEvents = 'none';
    overlay.style.fontFamily = 'monospace';
    overlay.style.zIndex = '9999';
    overlay.style.whiteSpace = 'nowrap';
    overlay.style.borderRadius = '4px';
    return overlay;
  }

  let totalSurplus = 0;

  document.querySelectorAll('img').forEach(img => {
    const width = img.offsetWidth;
    const height = img.offsetHeight;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    const ratio = (naturalWidth / width) * (naturalHeight / height);
    const ratioText = isFinite(ratio) ? ratio.toFixed(2) : 'N/A';

    if (getComputedStyle(img).position === 'static') {
      img.style.position = 'relative';
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'image-size-overlay-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';

    
    let surplus = 0;
    surplus = (height * width) * ratio;
    totalSurplus += surplus;

    surplus = (surplus / 1000000).toFixed(2) / 2 + " MB";

    const card1 = createOverlay(`${width}px × ${height}px`, '#0B6D7A');
    const card2 = createOverlay(`${naturalWidth}px × ${naturalHeight}px`, '#14C9E0');
    const card3 = createOverlay(`Ratio: ${ratioText}`, 'blue');
    const card4 = createOverlay(`~ Surplus: ${surplus}`, 'blue');

    if (ratio < 4) {
      card3.style.background = '#22C55D';
      card4.style.background = '#22C55D';
    } else if (ratio < 10) {
      card3.style.background = '#EBB305';
      card4.style.background = '#EBB305';
    } else if (ratio < 50) {
      card3.style.background = '#EF4444';
      card4.style.background = '#EF4444';
    } else {
      card3.style.background = 'linear-gradient(to right, #ef4444,rgb(172, 0, 255))';
      card4.style.background = 'linear-gradient(to right, #ef4444,rgb(172, 0, 255))';
      card3.innerHTML += ' !!!';
    }

    card1.style.top = '12px';
    card1.style.right = '6px';

    card2.style.top = '42px';
    card2.style.right = '6px';

    card3.style.top = '72px';
    card3.style.right = '6px';

    card4.style.top = '102px';
    card4.style.right = '6px';

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(card1);
    wrapper.appendChild(card2);
    wrapper.appendChild(card3);
    wrapper.appendChild(card4);
  });

  const cardBottomRight = createOverlay('~ Total Surplus: ' + (totalSurplus / 1000000).toFixed(2) / 2 + " MB", '#EF4444');
  cardBottomRight.style.bottom = '6px';
  cardBottomRight.style.right = '6px';
  cardBottomRight.style.fontSize = '14px';
  cardBottomRight.style.zIndex = '9998';
  document.body.appendChild(cardBottomRight);
}


window.addEventListener('extensionIconClicked', () => {
  addImageSizeOverlays();
});
