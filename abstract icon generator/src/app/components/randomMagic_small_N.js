function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

const magic = function () {
	let sizeFrame = Number(randomNumber(1, 21));
	return { sizeFrame };
};

const result = magic();
let sizeFrameRanddN = Math.ceil(result.sizeFrame);

export default sizeFrameRanddN;


