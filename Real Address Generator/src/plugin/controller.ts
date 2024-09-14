// Initialize Figma UI
figma.showUI(__html__, { width: 342, height: 512, themeColors: true });
 
// Importing datasets 
import aptlist from '../data/apt.json'; // APT data
import cpelist from '../data/cpe.json'; // CPE data
import cvelist from '../data/cve.json'; // CVE data
import clicksLeft from '../data/clicksLeft.json'; // Clicks Left data
import commutatorPort from '../data/commutatorPort.json'; // Commutator Port data
import devices from '../data/devices.json'; // Devices data
import departments from '../data/departments.json'; // Departments data
import cveDesc from '../data/cveDesc.json'; // CVE Descriptions data
import entities from '../data/entities.json'; // Entities data
import ioc from '../data/ioc.json'; // IOC data
import IP_addresses_port_huge_set from '../data/IP_addresses_port_huge_set.json'; // Large IP address dataset
import ip_addresses_one_network from '../data/ip_addresses_one_network.json'; // One network IP dataset
import random_ip from '../data/random_ip.json'; // Random IPs
import infosec_tools from '../data/infosec_tools.json'; // Infosec tools list
import Interface from '../data/Interface.json'; // Interface data
import mac_addresses from '../data/mac_addresses.json'; // MAC addresses
import os from '../data/os.json'; // Operating system data

function logAllDatasets() {
  console.log('APT List:', aptlist);
  console.log('CPE List:', cpelist);
  console.log('CVE List:', cvelist);
  console.log('Clicks Left:', clicksLeft);
  console.log('Commutator Port:', commutatorPort);
  console.log('Devices:', devices);
  console.log('Departments:', departments);
  console.log('CVE Description:', cveDesc);
  console.log('Entities:', entities);
  console.log('IOC:', ioc);
  console.log('IP Addresses Huge Set:', IP_addresses_port_huge_set);
  console.log('IP Addresses One Network:', ip_addresses_one_network);
  console.log('Random IP:', random_ip);
  console.log('InfoSec Tools:', infosec_tools);
  console.log('Interface:', Interface);
  console.log('MAC Addresses:', mac_addresses);
  console.log('Operating System:', os);
}

// Call the function to log datasets
logAllDatasets();

// Function to find all text nodes recursively
async function findTextNodes(node: SceneNode): Promise<ReadonlyArray<TextNode>> {
  const textNodes: TextNode[] = [];
  switch (node.type) {
    case 'FRAME':
    case 'GROUP':
    case 'COMPONENT':
    case 'COMPONENT_SET':
      const childPromises = node.children.map(childNode => findTextNodes(childNode));
      const foundTextNodes = await Promise.all(childPromises);
      textNodes.push(...foundTextNodes.flat());
      break;
    case 'TEXT':
      textNodes.push(node);
      break;
    default:
      break;
  }
  return textNodes;
}

function shuffleArray(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


async function assignRandomDataToNodes(dataset: string[]) {
  const selectedNodes = figma.currentPage.selection;

  if (selectedNodes.length === 0) {
    figma.notify('Please select at least one node.');
    return;
  }




  const fontsToLoad = new Set<string>();
  selectedNodes.forEach(node => {
    if ('fontName' in node) {
      const fontName = node.fontName as FontName;
      fontsToLoad.add(`${fontName.family}:${fontName.style}`);
    }
  });

  const fontPromises = Array.from(fontsToLoad).map(font => {
    const [family, style] = font.split(':');
    return figma.loadFontAsync({ family, style });
  });

  try {
    await Promise.all(fontPromises);
  } catch (error) {
    console.error('Error loading fonts:', error);
    figma.notify('Failed to load some fonts.');
    return;
  }

  for (const node of selectedNodes) {
    if ('characters' in node) {
      try {
        const randomData = dataset[Math.floor(Math.random() * dataset.length)];

        if (node.type === 'TEXT' && node.characters !== undefined) {
          node.characters = randomData;
        } else {
          console.warn('Node is not a valid text node or is in an invalid state.');
        }
      } catch (error) {
        console.error('Error assigning data to node:', error);
      }
    } else {
      console.warn('Selected node is not a text node.');
    }
  }

  figma.notify('Random data assigned to selected nodes.');
}
// Function to update text nodes
async function updateTextNode(node: TextNode): Promise<void> {
  if (typeof node.fontName === 'object') {
    await figma.loadFontAsync(node.fontName);
  }
  node.characters = node.name;
  return;
}

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  try {
    // Handle data assignment messages
    const dataAssignments: { [key: string]: any } = {
      'assign-apt-data': aptlist,
      'assign-cpe-data': cpelist,
      'assign-cve-data': cvelist,
      'assign-clicks-left-data': clicksLeft,
      'assign-commutator-port-data': commutatorPort,
      'assign-devices-data': devices,
      'assign-departments-data': departments,
      'assign-cve-desc-data': cveDesc,
      'assign-entities-data': entities,
      'assign-ioc-data': ioc,
      'assign-ip-addresses-huge-set': IP_addresses_port_huge_set,
      'assign-ip-one-network': ip_addresses_one_network,
      'assign-random-ip': random_ip,
      'assign-infosec-tools': infosec_tools,
      'assign-interface-data': Interface,
      'assign-mac-addresses': mac_addresses,
      'assign-os-data': os
    };

    if (msg.type in dataAssignments) {
      assignRandomDataToNodes(dataAssignments[msg.type]);
      return;
    }



    // Handle other messages
    if (msg.type === 'dds') {
      const data22 = msg.data22;
      const possibleValues = [
        'Al Mudhaibi, Ash Sharqiyah North',
        'Al Thanyah 2, Hadaeq Mohammed Bin Rashid, Dubai',
        'Mohammed Bin Rashid Boulevard, Old Town Residences, Burj Khalifa/Downtown Dubai, Dubai',
        'Al Muntazah, Abu Dhabi, Abu Dhabi Municipality, Abu Dhabi Emirate',
        'Al Mamourah street 9, Ghaf Al Ghirban street E25, Al Nahyan, Abu Dhabi, Abu Dhabi Municipality, Abu Dhabi Emirate'
      ];

      const selectedNodes = figma.currentPage.selection;
      const textNodes = await Promise.all(selectedNodes.flatMap(findTextNodes));
      await Promise.all(textNodes.flat().map(updateTextNode));

      const randomValue = possibleValues[Math.floor(Math.random() * possibleValues.length)];

      const promises = figma.currentPage.selection.map(async (selectedNode) => {
        if (selectedNode.type === 'TEXT') {
          const words = (data22 && data22.trim() !== '') ? data22.split(/\s+/) : [randomValue];
          const shuffleArray = (array: any[]) => {
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
          };
          await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
          const shuffledWords = shuffleArray([...words]);
          selectedNode.characters = shuffledWords.join(' ');
        }
      });

      await Promise.all(promises);
      console.log('All promises fulfilled');

      if (figma.currentPage.selection.length === 0 || !figma.currentPage.selection.some(node => node.type === 'TEXT')) {
        console.error('Please select at least one text node in Figma.');
      }
    } else if (msg.type === 'create-rectangles') {
      const selectedTextNodes = figma.currentPage.selection.filter(node => node.type === 'TEXT');

      for (const node of selectedTextNodes) {
        function getTextFromSelectedElement(selectedNode: SceneNode): string | null {
          if (selectedNode.type === 'TEXT') {
            return selectedNode.characters;
          }
          return null;
        }

        const textContent = getTextFromSelectedElement(node);
        if (textContent !== null) {
          const newText = figma.createText();
          newText.characters = textContent;
          newText.x = node.x + 50;
          newText.y = node.y + 50;
          const additionalTextNodes = await Promise.all(figma.currentPage.selection.flatMap(findTextNodes));
          await Promise.all(additionalTextNodes.flat().map(updateTextNode));
          figma.currentPage.appendChild(newText);
        }
      }

      figma.ui.postMessage({
        type: 'create-rectangles',
        message: `Created ${selectedTextNodes.length} Rectangles`,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    figma.ui.postMessage({ type: 'error', message: 'An error occurred while processing the selection.' });
  }

if (msg.type === 'assign-text') {
    const linesToAssign = msg.data; // The array of lines from the textarea
    const selectedNodes = figma.currentPage.selection;

    if (selectedNodes.length === 0) {
      figma.notify('Please select at least one text node.');
      return;
    }

    // Filter only text nodes from the selection
    const textNodes = selectedNodes.filter(node => node.type === 'TEXT') as TextNode[];

    if (textNodes.length === 0) {
      figma.notify('No text nodes selected.');
      return;
    }

    // Load fonts for all text nodes
    const fontsToLoad = new Set<string>();
    textNodes.forEach(node => {
      if ('fontName' in node) {
        const fontName = node.fontName as FontName;
        fontsToLoad.add(`${fontName.family}:${fontName.style}`);
      }
    });

    try {
      await Promise.all(Array.from(fontsToLoad).map(font => {
        const [family, style] = font.split(':');
        return figma.loadFontAsync({ family, style });
      }));
    } catch (error) {
      console.error('Error loading fonts:', error);
      figma.notify('Failed to load some fonts.');
      return;
    }

    // Shuffle the lines array to assign lines randomly
    const shuffledLines = shuffleArray(linesToAssign);

    // Loop through text nodes and assign random lines
    for (let i = 0; i < textNodes.length; i++) {
      const node = textNodes[i];
      const randomLine = shuffledLines[i % shuffledLines.length]; // Pick a random line from the shuffled list

      if ('characters' in node) {
        try {
          node.characters = randomLine;
        } catch (error) {
          console.error('Error assigning text to node:', error);
        }
      }
    }

    figma.notify('Random text assigned to selected nodes.');
  }
};
