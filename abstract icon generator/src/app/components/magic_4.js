function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

const magic = function () {
	let sizeFrame = Number(randomNumber(0.732, 2.621));
	return { sizeFrame };
};

const result = magic();
let sizeFrameRanddN222 = result.sizeFrame;

export default sizeFrameRanddN222;


