var DEBUG = true;

(function observeTooltipChanged() {
    DEBUG && console.log('observeTooltipChanged');
    var vivaldiTooltip = document.querySelector('#vivaldi-tooltip');
    if (vivaldiTooltip === null) {
        setTimeout(observeTooltipChanged, 300);
        return;
    }

    vivaldiTooltipObserver.observe(vivaldiTooltip, {
        characterData: false,
        attributes: false,
        childList: true,
        subtree: true
    });
})();

var vivaldiTooltipObserver = new MutationObserver(
    function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function (node) {
                    DEBUG && console.log('vivaldiTooltip mutation: addedNode: ', node, node.classList);
                    if (node.classList.contains('tooltip-item')) {
                        tooltip_thumbnail = node.querySelector('.thumbnail-image');
                        if (tooltip_thumbnail == null) {
                            return;
                        }
                        var tab_id = null;
                        document.querySelector('#tabs-container').querySelectorAll('.thumbnail-image').forEach(function(tab_thumbnail) {
                            if (tab_thumbnail.style.backgroundImage == tooltip_thumbnail.style.backgroundImage) {
                                tab_id = tab_thumbnail.parentElement.id.replace('tab-', '');
                            }
                        });
                        console.log('>>>' + tab_id);
                        var url = document.getElementById(tab_id).src.replace(/.*:\/\/(www\.)?/, '').replace(/\/.*/, '').split('.');
                        // google.com
                        switch(url.length) {
                            case 2:
                                tooltip_thumbnail.appendChild(formatUrl('', url[0], '.' + url[1]))
                                break;
                            case 3:
                                tooltip_thumbnail.appendChild(formatUrl(url[0] + '.', url[1], '.' + url[2]))
                                break;
                            default:
                                tooltip_thumbnail.appendChild(formatUrl('', url.join('.'), ''));
                        }
                    }
                });
            }
        });
    }
);

function formatUrl(top, middle, bottom) {
    function createOverlay(text, cssClass) {
        var overlay = document.createElement('div');
        overlay.classList += cssClass;
        overlay.textContent = text;
        overlay.style.zIndex = 1000;
        return overlay;
    }
    var overlayContainer = createOverlay('', 'thumbnail-url-container');
    var topOverlay = createOverlay(top, 'top');
    overlayContainer.appendChild(topOverlay);
    var middleOverlay = createOverlay(middle, 'middle');
    overlayContainer.appendChild(middleOverlay);
    var bottomOverlay = createOverlay(bottom, 'bottom');
    overlayContainer.appendChild(bottomOverlay);
    return overlayContainer;
}