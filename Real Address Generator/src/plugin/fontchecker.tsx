//    async function findTextNodes(node: SceneNode): Promise<ReadonlyArray<TextNode>> {
//     const textNodes = new Array<TextNode>()
//     switch (node.type) {
//         // Node types that can have child nodes.
//         case "FRAME":
//         case "GROUP":
//         case "COMPONENT":
//         case "COMPONENT_SET":
//             const foundTextNodes = await Promise.all(node.children.flatMap(findTextNodes))
//             textNodes.push(...foundTextNodes.flat())
//             break;
//         case "TEXT":
//             textNodes.push(node)
//             break;
//         default:
//             // ignore all other types of nodes. 
//             break;
//     }
//     return new Promise((resolve, _) => resolve(textNodes))
// }

// async function updateTextNode(node: TextNode): Promise<void> {
//     // We load the font async, but we could still avoid some API calls if we
//     // can check if the font is already loaded.
//     if (typeof node.fontName === "object") {
//         await figma.loadFontAsync(node.fontName)
//     }
//     node.characters = node.name
//     return new Promise((resolve, _) => resolve())
// }

// (async function () {
//     const selectedNodes = figma.currentPage.selection
//     // We want to recursively find all the text nodes for each selected node.
//     const textNodes = await Promise.all(selectedNodes.flatMap(findTextNodes))
//     await Promise.all(textNodes.flat().map(updateTextNode))
//     figma.closePlugin()
// })()


