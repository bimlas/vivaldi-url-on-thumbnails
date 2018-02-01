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
                        thumbnail = node.querySelector('.thumbnail-image');
                        if (thumbnail == null) {
                            return;
                        }
                        DEBUG && console.log('Thumbnail:', thumbnail);
                        var urlOverlay = document.createElement('div');
                        urlOverlay.textContent = 'URL';
                        urlOverlay.style.zIndex = 1000;
                        thumbnail.appendChild(urlOverlay);
                    }
//                    if (node.classList.contains('find-in-page')) {
//                        node.alertParentNode = getClosestParentByClass(node, 'webpageview');
//                        observeFindInPageChanged.observe(node, {
//                            characterData: true,
//                            attributes: true,
//                            childList: false,
//                            subtree: true
//                        });
//                    }
                });
            }
        });
    }
);
