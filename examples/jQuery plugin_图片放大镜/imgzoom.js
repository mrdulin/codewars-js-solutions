;(function ($, window, document, undefined) {
    $.extend($.fn, {
        imgZoom: function (o) {

            var s = {
                zoom: 2,
                url: '',
                zoomCtnSize: 1
            };

            if (o) $.extend(s, o);

            var $imgCtn = this,
                $imgBox = $imgCtn.find('.m-img-box'),
                $img = $imgBox.find('img');

            var cameraWidth,
                cameraHeight,
                cameraHalfWidth,
                cameraHalfHeight,
                imgCtnW,
                imgCtnH,
                pos;

            init();

            function init() {
                imgCtnW = _getWidth($imgCtn);
                imgCtnH = _getHeight($imgCtn);
                cameraWidth = imgCtnW / s.zoom;
                cameraHeight = imgCtnH / s.zoom;
                cameraHalfWidth = cameraWidth / 2;
                cameraHalfHeight = cameraHeight / 2;
                pos = {
                    left: cameraHalfWidth,
                    right: imgCtnW - cameraHalfWidth,
                    bottom: cameraHalfHeight,
                    top: imgCtnH - cameraHalfHeight
                };
                _bindEvent();
            }

            function _bindEvent() {
                $img.hover(handlerIn, handlerOut);
                $img.on('mousemove', imgMouseMoveHandler);
            }

            function _getHeight(obj) {
                return obj.height();
            }

            function _getWidth(obj) {
                return obj.width();
            }

            function _setSize(obj, w, h) {
                obj.css({
                    'width': w + 'px',
                    'height': h + 'px'
                });
            }

            function handlerIn(e) {
                var offsetX = e.offsetX,
                    offsetY = e.offsetY,
                    $camera;
                createZoomContainer();
                $camera = _createCameraArea();
                _setSize($camera, cameraWidth, cameraHeight);
                setCameraPos(offsetX - cameraHalfWidth, offsetY - cameraHalfHeight);
            }

            function imgMouseMoveHandler(e) {
                var offsetX = e.offsetX,
                    offsetY = e.offsetY,
                    x,
                    y,
                    $zoomCtn = $('#j-zoom-ct'),
                    $img = $zoomCtn.find('img');
                if (offsetX <= pos.left) {
                    x = 0;
                } else if (offsetX >= pos.right) {
                    x = imgCtnW - cameraWidth;
                } else {
                    x = offsetX - cameraHalfWidth
                }

                if (offsetY <= pos.bottom) {
                    y = 0;
                } else if (offsetY >= pos.top) {
                    y = imgCtnH - cameraHeight;
                } else {
                    y = offsetY - cameraHalfHeight
                }
                setCameraPos(x, y);
                if (!$img.length) {
                    createImg();
                }
                setImgPos(x, y);
            }

            function createImg() {
                var img = new Image(),
                    $zoomCtn = $('#j-zoom-ct');
                img.src = s.url;
                img.height = imgCtnH * s.zoom;
                img.width = imgCtnW * s.zoom;
                img.style.position = 'absolute';
                img.onload = function () {
                    $zoomCtn.append(img);
                }
            }

            function setImgPos(x, y) {
                var $zoomCtn = $('#j-zoom-ct'),
                    $img = $zoomCtn.find('img');

                $img.css({
                    'left': -x * s.zoom + 'px',
                    'top': -y * s.zoom + 'px'
                });
            }

            function setCameraPos(x, y) {
                var $camera = $('#j-camera');
                $camera.css({
                    'left': x + 'px',
                    'top': y + 'px'
                })
            }

            function handlerOut(e) {
                removeZoomContainer();
                removeCameraArea();
            }

            function createZoomContainer() {
                var $zoomCtn = $('<div id="j-zoom-ct" class="g-zoom-ct"></div>');
                $zoomCtn.css({
                    position: 'absolute',
                    top: 0,
                    width: imgCtnW,
                    height: imgCtnH,
                    left: '110%',
                    'background-color': '#ddd',
                    border: '1px solid #555',
                    overflow: 'hidden'
                });
                $imgCtn.append($zoomCtn);
            }

            function removeZoomContainer() {
                var $zoomCtn = $('#j-zoom-ct');
                if ($zoomCtn.length) {
                    $zoomCtn.remove();
                }
            }

            function _createCameraArea() {
                var $camera = $('<div id="j-camera" class="u-camera"></div>');
                $camera.css({
                    'position': 'absolute',
                    'background-color': '#555',
                    'opacity': 0.3,
                    'pointer-events': 'none'
                });
                $imgBox.append($camera);
                return $camera;
            }

            function removeCameraArea() {
                var $camera = $('#j-camera');
                if ($camera.length) {
                    $camera.remove();
                }
            }

            return this;
        }
    });
})(jQuery, window, document);