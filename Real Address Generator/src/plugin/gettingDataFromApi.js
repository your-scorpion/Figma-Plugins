import axios from 'axios';

// Geocoding
async function geocode(address) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        keywords: false,
        max_results: 20,
        format: 'json',
      },
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: result.display_name,
      };
    } else {
      throw new Error('No results found for the address');
    }
  } catch (error) {
    console.error('Error geocoding:', error);
    throw error;
  }
}



export { geocode };
