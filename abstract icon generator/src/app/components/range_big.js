function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

const magic = function () {
	let sizeFrame = Number(randomNumber(6, 80));
	return {sizeFrame};
};

const result = magic();
let range_bigjs = Math.ceil (result.sizeFrame);

export default range_bigjs;


