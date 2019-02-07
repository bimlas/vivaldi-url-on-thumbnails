var DEBUG = false;

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
                        showUrlOnThumbnail(node.querySelector('.thumbnail-text'));
                    }
                });
            }
        });
    }
);

function showUrlOnThumbnail(target_tab_title) {
    if (target_tab_title == null) {
        return;
    }

    // Skip if there is no thumbnail (current single tab)
    if(!target_tab_title.parentElement.parentElement.querySelector('.thumbnail-image')) {
        return;
    }

    var url = getUrlOfThumbnail(target_tab_title);

    // Skip speed dial, settings and other internal pages.
    if (url.startsWith('chrome')) {
        return;
    }

    target_tab_title.parentElement.parentElement.appendChild(createUrlOverlay(url));
}

function getUrlOfThumbnail(target_tab_title) {
    var tab_id = null;
    document.querySelector('#tabs-container').querySelectorAll('.tab-header .title').forEach(function (tab_title) {
        if (tab_title.innerText == target_tab_title.innerText) {
            tab_id = tab_title.parentElement.parentElement.id.replace('tab-', '');
        }
    });
    DEBUG && console.log('TAB ID OF THUMBNAIL:', tab_id);

    var url = document.getElementById(tab_id).src;
    DEBUG && console.log('URL:', url);
    return url;
}

function createUrlOverlay(url) {
    var urlPretty = url.replace(/.*:\/\/(www\.)?/, '').replace(/\/.*/, '').toUpperCase();
    var urlParts = urlPretty.split('.');
    var nbsp = '\xa0';
    switch (urlParts.length) {
        case 2:
            return formatUrl(nbsp, urlParts[0], '.' + urlParts[1]);
        case 3:
            return formatUrl(urlParts[0] + '.', urlParts[1], '.' + urlParts[2]);
        default:
            return formatUrl(nbsp, urlParts.join('.'), nbsp);
    }
}

function formatUrl(top, middle, bottom) {
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

function createOverlay(text, cssClass) {
    var overlay = document.createElement('div');
    overlay.classList += cssClass;
    overlay.textContent = text;
    return overlay;
}
