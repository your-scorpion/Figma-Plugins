// Initialize Figma UI
figma.showUI(__html__, { width: 320, height: 250, themeColors: true });

// Array to store styles information
let stylesInformation = [];

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  // Declare originalStyle variable
  //let originalStyle;

  // Handle 'dds' message type
  if (msg.type === 'dds') {
    // Extract values from the msg object
    // const dataValueAddress = msg.dataValueAddress;
    const data22 = msg.data22;

    // Load 'Inter' Regular font asynchronously

    try {

      // Array of possible values
      const possibleValues = [
        'Al Mudhaibi, Ash Sharqiyah North',
        'Al Thanyah 2, Hadaeq Mohammed Bin Rashid, Dubai',
        'Mohammed Bin Rashid Boulevard, Old Town Residences, Burj Khalifa/Downtown Dubai, Dubai',
        'Al Muntazah, Abu Dhabi, Abu Dhabi Municipality, Abu Dhabi Emirate',
        'Al Mamourah street 9, Ghaf Al Ghirban street E25, Al Nahyan, Abu Dhabi, Abu Dhabi Municipality, Abu Dhabi Emirate',
      ];





async function findTextNodes(node: SceneNode): Promise<ReadonlyArray<TextNode>> {
  const textNodes: TextNode[] = [];

  switch (node.type) {
    case "FRAME":
    case "GROUP":
    case "COMPONENT":
    case "COMPONENT_SET":
      const childPromises = node.children.map((childNode) => findTextNodes(childNode));
      const foundTextNodes = await Promise.all(childPromises);
      textNodes.push(...foundTextNodes.flat());
      break;
    case "TEXT":
      textNodes.push(node);
      break;
    default:
      // Ignore all other types of nodes. 
      break;
  }

  return textNodes;
}







async function updateTextNode(node: TextNode): Promise<void> {
    // Log when the updateTextNode promise starts
    //console.log(`updateTextNode Promise Started for node: ${node.id}`);

    // We load the font async, but we could still avoid some API calls if we
    // can check if the font is already loaded.
    if (typeof node.fontName === "object") {
        await figma.loadFontAsync(node.fontName)
    }
    node.characters = node.name

    // Log when the updateTextNode promise is resolved
    //console.log(`updateTextNode Promise Resolved for node: ${node.id}`);
    
    return new Promise((resolve, _) => resolve())
}

(async function () {
    const selectedNodes = figma.currentPage.selection
    // We want to recursively find all the text nodes for each selected node.
    const textNodes = await Promise.all(selectedNodes.flatMap(findTextNodes))
    await Promise.all(textNodes.flat().map(updateTextNode))
    //figma.closePlugin()

})()






var fontsToLoad: FontName[] = []

      // Pick a random value from the array
      const randomValue = possibleValues[Math.floor(Math.random() * possibleValues.length)];

      //let originalStyle;
      // Loop through all selected text nodes
      figma.currentPage.selection.forEach(async (selectedNode) => {
        if (selectedNode.type === 'TEXT') {
          const words = data22 && data22.trim() !== '' ? data22.split(/\s+/) : [randomValue];

          const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
          };


console.clear()

  
// get an array of loadFontAsync() promises, one for each entry in foundFonts[]
         const fontPromises = fontsToLoad.map(f => figma.loadFontAsync(f));
            // text is set only after all fonts are loaded
            Promise.all(fontPromises).then(() => {
                this.layersToNumber.map(l => this.setTextOfNode(l.layer, this.optionalPrefix, l.number.toString()))
            })



   

       const promises = figma.currentPage.selection.map(async (selectedNode) => {
      if (selectedNode.type === 'TEXT') {
        // Shuffle the array of words
        await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
                      const shuffledWords = shuffleArray([...words]);
        const shuffledData22 = shuffledWords.join(' ');
         selectedNode.characters = shuffledData22;

        // Shuffle logic...


        // Return a resolved promise
        return Promise.resolve();
      }
    });
  

          // Shuffle the array of words
         //originalStyle = selectedNode.fontName;
          await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
     await Promise.all(promises);

     console.log('All promises fulfilled');


   

          // Extract family and style from originalStyle
          //const { family } = originalStyle;
          
          // Create the font object using the extracted values
          //const font = { family, style: "Medium" }; // You can set the style property as needed

          // Load font asynchronously (if required)
          // await figma.loadFontAsync(font);

          // Now, you can use the 'font' object as needed
          //console.log('Font:', font);


        }

      });

     //console.log(originalStyle);



      // If there are no selected text nodes, log an error
      if (figma.currentPage.selection.length === 0 || !figma.currentPage.selection.some((node) => node.type === 'TEXT')) {
        console.error('Please select at least one text node in Figma.');
      }
    } catch (error) {
      console.error('Error:', error);
      figma.ui.postMessage({ type: 'error', message: 'An error occurred while processing the selection.' });
    }
  } 

  // Handle 'create-rectangles' message type
  if (msg.type === 'create-rectangles') {
    // Get information if the user selected a text element
    const selectedTextNodes = figma.currentPage.selection.filter(node => node.type === 'TEXT');

    for (const node of selectedTextNodes) {
      //console.log("Text node selected");

      // Function to get text from the selected element
      function getTextFromSelectedElement(selectedNode) {
        // Check if the selected element is a text node

        if (selectedNode.type === 'TEXT') {
          // Return the text content of the text node
          return selectedNode.characters;

        }

        // If no text node is found, return a default value or handle it as needed
        return null;
      }

      // Function to convert multiline text to separate strings
      /*function convertMultilineTextToSeparateStrings(textContent) {
        const lines = textContent.split('\n');
        return lines;
      }*/

      // Get text content from the selected element
      const textContent = getTextFromSelectedElement(node);
      console.log('Text content:', textContent);
      //console.log(textContent);
      
      // Extract family and style from the originalStyle (assuming it exists in your code)
      //const { family } = originalStyle;
      
      // Create the font object using the extracted values
      //const font = { family, style: "Medium" }; // You can set the style property as needed

      //console.log('Font loaded');









      if (textContent !== null) {
        //console.log("Text content:", textContent);

        // Split multiline text into separate variables
        //const linesArray = convertMultilineTextToSeparateStrings(textContent);
       // console.log(linesArray + "_____ are here"); // Multilines are obtained

        // Create a new text node
        const newText = figma.createText();
        newText.characters = textContent; // Set the text content dynamically
        //newText.fontName = font;

        // Set the position of the new text node (you might want to adjust this based on your requirements)
        newText.x = node.x + 50;
        newText.y = node.y + 50;
                      const additionalTextNodes = await Promise.all(figma.currentPage.selection.flatMap(findTextNodes));

              await Promise.all(additionalTextNodes.flat().map(updateTextNode));

        // Attach the created text node to the current page
        figma.currentPage.appendChild(newText);

      }
    }


    // Respond back to the UI
    figma.ui.postMessage({
      type: 'create-rectangles',
      message: `Created ${selectedTextNodes.length} Rectangles`,
    });
  }

  // Close the Figma plugin
  //figma.closePlugin();
};
