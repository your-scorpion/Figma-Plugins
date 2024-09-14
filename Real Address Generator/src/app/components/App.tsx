import React from 'react';
import '../styles/ui.css';
import Stringer from './Stringer';
import './cat.css';
import MuiButton from "@mui/material/Button";
import { Grid } from '@mui/material';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';

interface AppState {
  text: string;
  openAccordion: number | null; // Store the index of the open accordion
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    text: '',
    openAccordion: null // No accordion open by default
  };

  handleAccordionChange = (index: number) => {
    // Toggle the accordion open state
    this.setState({ openAccordion: this.state.openAccordion === index ? null : index });
  };

  handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.setState((prevState) => ({
              text: prevState.text + (e.target.result as string)
            }));
          }
        };
        reader.readAsText(file);
      }
    }
  };

  handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.setState((prevState) => ({
            text: prevState.text + (e.target.result as string)
          }));
        }
      };
      reader.readAsText(file);
    }
  };

  handleAssignAPTData = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-apt-data' } }, '*');
  };

  handleAssignCPEData = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-cpe-data' } }, '*');
  };

  handleAssignCVEData = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-cve-data' } }, '*');
  };

  handleAssignClicksLeftData = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-clicks-left-data' } }, '*');
  };

  handleAssignCommutatorPortData = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-commutator-port-data' } }, '*');
  };

  handleAssignDevicesData = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-devices-data' } }, '*');
  };

  handleAssignDepartmentsData = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-departments-data' } }, '*');
  };

  handleAssignCveDescData = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-cve-desc-data' } }, '*');
  };

  handleAssignEntitiesData = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-entities-data' } }, '*');
  };

  handleAssignIOCData = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-ioc-data' } }, '*');
  };

  handleAssignIPAddressesHugeSet = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-ip-addresses-huge-set' } }, '*');
  };

  handleAssignIPOneNetwork = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-ip-one-network' } }, '*');
  };

  handleAssignRandomIP = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-random-ip' } }, '*');
  };

  handleAssignInfosecTools = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-infosec-tools' } }, '*');
  };

  handleAssignInterfaceData = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-interface-data' } }, '*');
  };

  handleAssignMACAddresses = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-mac-addresses' } }, '*');
  };

  handleAssignOSData = () => {
    parent.postMessage({ pluginMessage: { type: 'assign-os-data' } }, '*');
  };

  onCreate = () => {
    parent.postMessage({ pluginMessage: { type: 'create-rectangles' } }, '*');
  };

  assignText = () => {
    const { text } = this.state;
    const lines = text.split('\n').filter(line => line.trim() !== '');
    parent.postMessage({ pluginMessage: { type: 'assign-text', data: lines } }, '*');
  };

  componentDidMount() {
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
    };
  }

  render() {
    const { text, openAccordion } = this.state;

    return (
      <span>
        <div className="row" id="ajodhakdhak">
          <div>
            <AccordionGroup sx={{ maxWidth: 400 }}>
              <Accordion expanded={openAccordion === 0} onChange={() => this.handleAccordionChange(0)}>
                <AccordionSummary>Upload Dataset</AccordionSummary>
                <AccordionDetails>
                  <div id="drop-area" onDrop={this.handleDrop} onDragOver={(e) => e.preventDefault()}>
                    <p style={{ color: "#ffffff" }}>Drag & drop text files here or click to select files</p>
                    <input
                      type="file"
                      id="fileElem"
                      multiple
                      accept=".txt"
                      style={{ display: 'none' }}
                      onChange={this.handleFileSelect}
                    />
                    <button className="custom-button" 
                      style={{
    borderRadius: '5px', /* Rounded corners */

    transition: 'background-color 0.3s ease' /* Smooth background color transition */
  }}

                    onClick={() => document.getElementById('fileElem')?.click()}>Select Files</button>
                    <textarea
                      id="textArea"
                      value={text}
                      onChange={(e) => this.setState({ text: e.target.value })}
                      placeholder="Paste or type text here..."
                      style={{ width: '100%', height: '200px' }}
                    />
                    <button onClick={() => this.assignText()}>Assign text</button>
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={openAccordion === 1} onChange={() => this.handleAccordionChange(1)}>
                <AccordionSummary>Ready datasets</AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={0.5}>
                    {[
                      { label: 'APT', handler: this.handleAssignAPTData },
                      { label: 'CPE', handler: this.handleAssignCPEData },
                      { label: 'CVE', handler: this.handleAssignCVEData },
                      { label: 'Clicks Left', handler: this.handleAssignClicksLeftData },
                      { label: 'Commutator Port', handler: this.handleAssignCommutatorPortData },
                      { label: 'Devices', handler: this.handleAssignDevicesData },
                      { label: 'Departments', handler: this.handleAssignDepartmentsData },
                      { label: 'CVE Descriptions', handler: this.handleAssignCveDescData },
                      { label: 'Entities', handler: this.handleAssignEntitiesData },
                      { label: 'IOC', handler: this.handleAssignIOCData },
                      { label: 'IP Addresses Huge Set', handler: this.handleAssignIPAddressesHugeSet },
                      { label: 'IP One Network', handler: this.handleAssignIPOneNetwork },
                      { label: 'Random IP', handler: this.handleAssignRandomIP },
                      { label: 'Infosec Tools', handler: this.handleAssignInfosecTools },
                      { label: 'Interface Data', handler: this.handleAssignInterfaceData },
                      { label: 'MAC Addresses', handler: this.handleAssignMACAddresses },
                      { label: 'OS Data', handler: this.handleAssignOSData }
                    ].map((button, index) => (
                      <Grid item xs="auto" key={index}>
                        <MuiButton variant="contained" color="success" onClick={button.handler}>
                          {button.label}
                        </MuiButton>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={openAccordion === 2} onChange={() => this.handleAccordionChange(2)}>
                <AccordionSummary>Generate Address</AccordionSummary>
                <AccordionDetails>
                  <div className="row">
                    <div id="uniswap" style={{ backgroundColor: "#262627", minHeight: "220px", borderRadius: '18px', padding: '8px', marginLeft: '-12px'}}>
                      <Stringer />
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>

            </AccordionGroup>
          </div>
        </div>
      </span>
    );
  }
}

export default App;
