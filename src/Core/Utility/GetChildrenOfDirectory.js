/*
	This returns all the files and folders given a directory. Note that the lookup isn't recursive
*/

const fs = require("fs");
const path = require("path");

///

module.exports = (directory) => {
	const files = fs.readdirSync(directory, { withFileTypes: true });

	let fileNames = [];

	for (const file of files) {
		const filePath = path.join(directory, file.name);

		fileNames.push(filePath);
	}

	return fileNames;
};
