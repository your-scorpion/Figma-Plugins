import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { geocode } from '../../plugin/gettingDataFromApi.js';
import addToCart from '../../plugin/addtoCard.js';
import './cat.css';
import '../styles/ui.css';

const MyComponent = styled.h4`
  fontSize: '13',
  color: 'blue',
  maxWidth: '305px',
    align-content: 'center',
  display: 'block',
    align-items: 'center',
  justify-content: 'center',
    position: 'absolute',
  left: '50%',
  z-index: '0'
`;



function Stringer() {
  const [addressExample, setAddressExample] = useState('');
  const [address, setAddress] = useState('');
  const [dataValueAddress, setDataValueAddress] = useState('');

  useEffect(() => {
    fetchDataAndLog();
  }, [addressExample]); // Only re-run the effect if addressExample changes

  async function fetchDataAndLog() {
    try {
      const response = await geocode(addressExample);
      const addressValue = response.address;
      setAddress(addressValue);
    } catch (error) {
      console.error('Error:', error);
      setAddress('');
    }
  }


 const onCreate = () => {
    const count = countRef.current.value;
    parent.postMessage({ pluginMessage: { type: 'dds', count, dataValueAddress, data22: address } }, '*');
  };

console.clear()


const handleInputChange = (event) => {
  const inputValue = event.target.value;
  setAddressExample(inputValue);
  setDataValueAddress(inputValue);

  // Call onCreate here
  onCreate();
};

  const countRef = React.useRef(null);


  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type } = event.data.pluginMessage;
      if (type === 'dds') {
        addToCart(12, 33);
      }
    };
  }, []);

  return (
    <div> 

      <p>
         <a style={{ color: address ? '#656565' : 'white' }}>Select Textlayers.</a> <span style={{color: "#656565"}}>Enter a query here: </span>{' '}
        <input
          type="text"
          name="ddd"
          placeholder='Just start typing any place...'
          id="star"
          value={addressExample}
          onChange={handleInputChange} // Handle input changes
        />
      </p>


      <button onClick={onCreate}>
        Reassign address
      </button>
      <input
        id = 'doverie'
        type="text"
        value={address}
        onChange={() => {}} // No need to handle changes here
        ref={countRef}
      />
      <MyComponent>
        <div className="grow">{address ? <pre style={{ color: 'white' }}>{address}</pre> : <p style={{color: '#989898'}}>No data available</p>}</div>
      </MyComponent>

      {/*<input
        type="text"
        value={address}
        onChange={() => {}} // No need to handle changes here
        ref={countRef}
      />*/}

    </div>
  );
}

export default Stringer;
