figma.showUI(__html__, { width: 300, height: 384, title: "Pattern Line Generator" });
//by Max Tcvetkov --- www.eng.your-scorpion.ru
let randomN = 1.01 - 0.5 + Math.random() * (1 - 0.999);
let randomN2 = 8.12 - 0.75 + Math.random() * (1.04 - 1.46);
figma.ui.onmessage = msg => {
    if (msg.type === 'actionGenerate') {
        const { spacing, rotation, namePrefix, strokeWeight, numOfLines, strokeColorRed, strokeColorGreen, strokeColorBlue } = msg.formDataObj;
        const linesFrame = figma.createFrame();
        linesFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        linesFrame.name = 'Result';
        linesFrame.primaryAxisAlignItems = 'MAX';
        linesFrame.counterAxisAlignItems = 'MAX';
        for (let i = 1; i < numOfLines; i++) {
            const tintnote = figma.createLine();
            tintnote.name = ' ' + (i * 1 + ' ' + namePrefix);
            let str33 = [1, 3, 4, 12, 16, 34, 33, 2, 5, 12];
            let random = str33[Math.floor(Math.random() * str33.length)];
            tintnote.opacity = 1 / random;
            let strokeColorRedTransfered = parseFloat(strokeColorRed);
            let strokeColorGreenTransfered = parseFloat(strokeColorGreen);
            let strokeColorBlueTransfered = parseFloat(strokeColorBlue);
            tintnote.strokes = [{ type: 'SOLID', color: { r: strokeColorRedTransfered, g: strokeColorGreenTransfered, b: strokeColorBlueTransfered } }];
            let opanki = parseFloat(strokeWeight);
            tintnote.strokeWeight = opanki;
            tintnote.strokeCap = "ROUND";
            linesFrame.appendChild(tintnote);
            linesFrame.layoutAlign = "STRETCH";
            let next = [10, 20, 30, 40, 50, 60];
            tintnote.rotation = randomN * randomN2 / Math.min(Math.random() * next.length - 1) * rotation;
            figma.closePlugin('Done nicely!');
        }
        linesFrame.layoutMode = "HORIZONTAL";
        linesFrame.layoutAlign = "STRETCH";
        linesFrame.primaryAxisAlignItems = 'SPACE_BETWEEN';
        linesFrame.counterAxisAlignItems = "CENTER";
        linesFrame.paddingBottom = 24;
        linesFrame.paddingRight = 24;
        linesFrame.paddingLeft = 24;
        linesFrame.paddingTop = 24;
        linesFrame.itemSpacing = Math.random() * spacing;
    }
    else if (msg.type === 'actionExit') {
        figma.closePlugin('See you soon 🎨');
    }
};
