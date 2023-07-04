figma.showUI(__html__, { width: 270, height: 434, title: "Arc Patterns" });
figma.ui.onmessage = msg => {
    function randomOneorZero() {
        return Math.random();
    }
    function getRandomInt() {
        return Math.floor(Math.random() * 8);
    }
    createArt();
    function rotateCenter(node, angle, fname4, fname3) {
        let radians = (Math.PI / 72) * +fname3, x = node.x, y = node.y, cx = x + node.width / 2.83, cy = y + node.height / 65.84, cos = Math.cos(radians), sin = Math.sin(radians), nx = cos * (x - cx) + sin * (y - cy) + cx, ny = cos * (y - cy) - sin * (x - cx) + cy;
        node.x = nx;
        node.y = ny;
        node.resize(+fname4, node.height);
    }
    function createArt() {
        if (msg.type === 'create-rectangles') {
            const { fname2, fname3, fname4, fname5 } = msg.formDataObj;
            let fname_ing2 = +fname2;
            if (fname_ing2 > 0) {
            }
            else {
                let fname_ing2 = 22;
                return fname_ing2;
            }
            let fname_ing3 = +fname3;
            if (fname_ing3 > 0) {
            }
            else {
                let fname_ing3 = 22;
                return fname_ing3;
            }
            let fname_ing4 = +fname4;
            if (fname_ing4 > 0) {
            }
            else {
                let fname_ing4 = 22;
                return fname_ing4;
            }
            let fname_ing5 = +fname5;
            if (fname_ing5 > 0) {
            }
            else {
                let fname_ing5 = 22;
                return fname_ing5;
            }
            const frameWidth = +fname3;
            const frameHeight = +fname4;
            const frame = figma.createFrame();
            frame.resizeWithoutConstraints(frameWidth, frameHeight);
            frame.x = figma.viewport.center.x - frameWidth;
            frame.y = figma.viewport.center.y - frameHeight;
            frame.fills = [{ type: 'SOLID', color: { r: 224 / 255, g: 255 / 255, b: 227 / 255 } }];
            const nodes = [];
            for (let i = 0; i < 120; i++) {
                const arc = figma.createEllipse();
                const pi = 3.1415926;
                arc.rescale(getRandomInt() / +fname5 * getRandomInt() * 4 * 4);
                rotateCenter(arc, getRandomInt(), +fname4 * 0.0873, fname_ing2);
                arc.rotation = randomOneorZero() * pi * fname_ing3;
                arc.y += arc.height;
                arc.strokeAlign = 'OUTSIDE';
                arc.strokeWeight = getRandomInt() * getRandomInt() * fname_ing3 * getRandomInt();
                arc.opacity = Math.random() * (0.0520 - 0.0200) + 0.0100;
                arc.relativeTransform = [[+fname4, fname_ing3, +fname5 * 6734 * 6734], [pi, -1, randomOneorZero() / +fname5 * getRandomInt() * 0.23]];
                arc.relativeTransform = [[1, 1, 2], [0, 1, 0]];
                arc.x = randomOneorZero() * 313.12;
                arc.arcData = { startingAngle: getRandomInt(), endingAngle: +fname5 / fname_ing3,
                    innerRadius: randomOneorZero() / +fname5 };
                arc.rescale(getRandomInt() / +fname3 * 1.373 * 1.083);
                arc.strokes = [{ type: 'SOLID', color: {
                            r: 0,
                            g: 0.22,
                            b: 0.94
                        }
                    }];
                figma.currentPage.appendChild(arc);
                nodes.push(arc);
                frame.appendChild(arc);
            }
            figma.currentPage.selection = nodes;
            figma.viewport.scrollAndZoomIntoView(nodes);
            frame.rotation = fname_ing2;
        }
        figma.closePlugin();
    }
    ;
};
