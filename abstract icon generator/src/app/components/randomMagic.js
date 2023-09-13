// Generate a random number between min and max (inclusive)
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// Generate a random sizeFrame value
const magic = function () {
    let sizeFrame3 = Number(randomNumber(-183, 121)); // Generate a random number between -183 and 121
    return { sizeFrame3 }; // Return the sizeFrame value as an object
};

const result = magic(); // Call the magic function to get the result
let sizeFrameRandd = result.sizeFrame3; // Access the sizeFrame value from the result object
export default sizeFrameRandd; // Export the sizeFrameRandd as the default export
