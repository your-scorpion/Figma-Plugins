
import axios from 'axios';

function addToCart(id, quantity) {
	axios({
		method: 'POST',
		url: 'api/cart',
		headers: {
			'Content-Type': 'application/json',
		},
		data: {
			id: id,
			quantity: quantity,
		},
	}).then((response) => {
		if (response.status === 200) {
			return axios({
				method: 'GET',
				url: 'api/cart',
			}).then((getResponse) => {
				// Return the response data from the GET request
				return getResponse.data;
			});
		}
	});
}

export default addToCart;
