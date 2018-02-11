var DEBUG = true;

(function observeTopNodeWhenExists() {
    var topNode = document.querySelector('#vivaldi-tooltip');
    if (topNode === null) {
        setTimeout(observeTopNodeWhenExists, 300);
        return;
    }
    observer.observe(topNode, {
        characterData: false,
        attributes: false,
        childList: true,
        subtree: true
    });
})();

var observer = new MutationObserver(
    function (mutations) {
        mutations.forEach(function (mutation) {
            DEBUG && console.log('MUTATION', mutation.type);
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function (node) {
                    DEBUG && console.log('ADDED NODE:', node.classList.toString(), node);
                    if (node.classList.contains('tooltip-item') || node.classList.contains('tooltip')) {
                        showUrlOnThumbnail(node.querySelector('.thumbnail-image'));
                    }
                });
            }
        });
    }
);

function showUrlOnThumbnail(target_thumbnail) {
    if (target_thumbnail == null) {
        return;
    }
    var tab_id = null;
    document.querySelector('#tabs-container').querySelectorAll('.thumbnail-image').forEach(function(tab_thumbnail) {
        if (tab_thumbnail.style.backgroundImage == target_thumbnail.style.backgroundImage) {
            tab_id = tab_thumbnail.parentElement.id.replace('tab-', '');
        }
    });
    DEBUG && console.log('TAB ID OF THUMBNAIL:', tab_id);

    var url = document.getElementById(tab_id).src;
    DEBUG && console.log('URL:', url);
    // Skip speed dial, settings and other internal pages.
    if (url.startsWith('chrome')) {
        return;
    }

    url = url.replace(/.*:\/\/(www\.)?/, '').replace(/\/.*/, '').toUpperCase().split('.')

    var nbsp = '\xa0';
    switch(url.length) {
        case 2:
            target_thumbnail.appendChild(formatUrl(nbsp, url[0], '.' + url[1]))
            break;
        case 3:
            target_thumbnail.appendChild(formatUrl(url[0] + '.', url[1], '.' + url[2]))
            break;
        default:
            target_thumbnail.appendChild(formatUrl(nbsp, url.join('.'), nbsp));
    }
}

function formatUrl(top, middle, bottom) {
    function createOverlay(text, cssClass) {
        var overlay = document.createElement('div');
        overlay.classList += cssClass;
        overlay.textContent = text;
        return overlay;
    }
    var overlayContainer = createOverlay('', 'thumbnail-url-overlay');
    var alignmentContainer = createOverlay('', 'thumbnail-url-alignment');
    var topOverlay = createOverlay(top, 'top');
    alignmentContainer.appendChild(topOverlay);
    var middleOverlay = createOverlay(middle, 'middle');
    alignmentContainer.appendChild(middleOverlay);
    var bottomOverlay = createOverlay(bottom, 'bottom');
    alignmentContainer.appendChild(bottomOverlay);
    overlayContainer.appendChild(alignmentContainer);
    return overlayContainer;
}