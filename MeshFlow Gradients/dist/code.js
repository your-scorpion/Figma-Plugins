/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************************!*\
  !*** ./src/plugin/controller.ts ***!
  \**********************************/
figma.showUI(__html__, { width: 640, height: 530 });
figma.ui.onmessage = (msg) => {
    const newDat22a = msg.capturedDataURLData;
    const heightheight = msg.height;
    const widthwidth = msg.width;
    let x = 0;
    if (msg.type === 'create-rectangles') {
        const nodes = [];
        const rectPromises = [];
        for (let i = 0; i < msg.count; i++) {
            function getRandomValue() {
                return Math.random() * 1400 - 700;
            }
            const rect = figma.createRectangle();
            rect.x = getRandomValue();
            rect.y = x;
            rect.resize(widthwidth * 2, heightheight * 2);
            const imagePromise = figma.createImageAsync(newDat22a);
            rectPromises.push(imagePromise.then((image) => {
                rect.fills = [
                    {
                        type: 'IMAGE',
                        imageHash: image.hash,
                        scaleMode: 'FILL',
                    },
                ];
                return rect;
            }));
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
            x += rect.width + 32;
            if (i > 0 && i % 2 === 1) {
                x += 640;
            }
        }
        Promise.all(rectPromises).then((rects) => {
            rects.forEach((rect) => {
                nodes.push(rect);
            });
            figma.currentPage.selection = [nodes[0]];
            const selectedNode = nodes[0];
            const zoomToSelection = async () => {
                await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
                figma.viewport.scrollAndZoomIntoView([selectedNode]);
            };
            zoomToSelection();
            figma.ui.postMessage({
                type: 'create-rectangles',
                message: `Created ${msg.count} Rectangles`,
            });
        });
    }
};

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUF5Qix5QkFBeUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixlQUFlO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsb0NBQW9DO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsV0FBVztBQUMvQyxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9maWdtYS1wbHVnaW4tcmVhY3QtdGVtcGxhdGUvLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiA2NDAsIGhlaWdodDogNTMwIH0pO1xyXG5maWdtYS51aS5vbm1lc3NhZ2UgPSAobXNnKSA9PiB7XHJcbiAgICBjb25zdCBuZXdEYXQyMmEgPSBtc2cuY2FwdHVyZWREYXRhVVJMRGF0YTtcclxuICAgIGNvbnN0IGhlaWdodGhlaWdodCA9IG1zZy5oZWlnaHQ7XHJcbiAgICBjb25zdCB3aWR0aHdpZHRoID0gbXNnLndpZHRoO1xyXG4gICAgbGV0IHggPSAwO1xyXG4gICAgaWYgKG1zZy50eXBlID09PSAnY3JlYXRlLXJlY3RhbmdsZXMnKSB7XHJcbiAgICAgICAgY29uc3Qgbm9kZXMgPSBbXTtcclxuICAgICAgICBjb25zdCByZWN0UHJvbWlzZXMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zZy5jb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFJhbmRvbVZhbHVlKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAxNDAwIC0gNzAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcclxuICAgICAgICAgICAgcmVjdC54ID0gZ2V0UmFuZG9tVmFsdWUoKTtcclxuICAgICAgICAgICAgcmVjdC55ID0geDtcclxuICAgICAgICAgICAgcmVjdC5yZXNpemUod2lkdGh3aWR0aCAqIDIsIGhlaWdodGhlaWdodCAqIDIpO1xyXG4gICAgICAgICAgICBjb25zdCBpbWFnZVByb21pc2UgPSBmaWdtYS5jcmVhdGVJbWFnZUFzeW5jKG5ld0RhdDIyYSk7XHJcbiAgICAgICAgICAgIHJlY3RQcm9taXNlcy5wdXNoKGltYWdlUHJvbWlzZS50aGVuKChpbWFnZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVjdC5maWxscyA9IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdJTUFHRScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSGFzaDogaW1hZ2UuaGFzaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVNb2RlOiAnRklMTCcsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVjdDtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChyZWN0KTtcclxuICAgICAgICAgICAgbm9kZXMucHVzaChyZWN0KTtcclxuICAgICAgICAgICAgeCArPSByZWN0LndpZHRoICsgMzI7XHJcbiAgICAgICAgICAgIGlmIChpID4gMCAmJiBpICUgMiA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgeCArPSA2NDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgUHJvbWlzZS5hbGwocmVjdFByb21pc2VzKS50aGVuKChyZWN0cykgPT4ge1xyXG4gICAgICAgICAgICByZWN0cy5mb3JFYWNoKChyZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBub2Rlcy5wdXNoKHJlY3QpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW25vZGVzWzBdXTtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWROb2RlID0gbm9kZXNbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IHpvb21Ub1NlbGVjdGlvbiA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IGZpZ21hLmxvYWRGb250QXN5bmMoeyBmYW1pbHk6ICdSb2JvdG8nLCBzdHlsZTogJ1JlZ3VsYXInIH0pO1xyXG4gICAgICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtzZWxlY3RlZE5vZGVdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgem9vbVRvU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjcmVhdGUtcmVjdGFuZ2xlcycsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBgQ3JlYXRlZCAke21zZy5jb3VudH0gUmVjdGFuZ2xlc2AsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=