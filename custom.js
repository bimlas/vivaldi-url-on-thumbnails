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
                        document.querySelector('#tabs-container').querySelectorAll('.thumbnail-image').forEach(function(thumbnail) {
                            tab_id = thumbnail.parentElement.id.replace('tab-', '')
                            console.log('>>>');
                            if (thumbnail.style.backgroundImage == tooltip_thumbnail.style.backgroundImage) {
                                return;
                            }
                        });
                        var url = document.getElementById(tab_id).src;
                        var urlOverlay = document.createElement('div');
                        urlOverlay.textContent = url;
                        urlOverlay.style.zIndex = 1000;
                        tooltip_thumbnail.appendChild(urlOverlay);
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
