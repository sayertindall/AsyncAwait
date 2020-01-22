const fs = require('fs');
const path = require('path');
const date = Date.now().toString(); 
const directoryPath = process.cwd();


// Task 1. Using node.js's built-in `fs` module create X numbered files named `taskOne_[fileNumber]`.
// fileNumber is the order in which the files were created.
// Log `Creating file [fileName]` to the console before the file is written.
// Log `Finished creating file [fileName]` after the file is written.
const writeTo = (fileName, decision = true) => {
	let pathToFile = decision ? path.resolve(directoryPath, date, fileName) : `notHome`;
	if (!decision) throw new Error(`File ${fileName} failed to write`);
	return new Promise((resolve, reject) => {
		fs.writeFile(pathToFile, 'data', (err) => {
			if (err) reject(err);
			resolve()
		});
	})
}

async function taskOne(reps) {
	console.log(`Starting task taskOne`);
	for (let i = 0; i < reps; i++) {
		let fileName = `taskOne_${i}`;
		console.log(`Creating file ${fileName}`);
		await writeTo(fileName);
		console.log(`Finished creating ${fileName}`);
	}
	console.log(`Finished task taskOne`);
}


// Task 2. Create X numbered files named `taskTwo_[1-5]`.
// The result should be files numbered 1-5 irrelevant of write order
// The files should be written all at once without waiting for others to complete.
// Log `Creating file [fileName]` to the console before the file is written.
// Log `Finished creating file [fileName]` after the file is written.
// Wait for all files to complete before proceeding to the next task.
async function taskTwo(reps) {
	console.log(`Starting task taskTwo`);
	let promises = [];
	for (let i = 0; i < reps; i++) {
		let fileName = `taskTwo_${i}`;
		console.log(`Creating file ${fileName}`);
		promises.push(
			writeTo(fileName)
				.then(() => { console.log(`Finished creating ${fileName}`)})
				.catch(er => console.error(er))
		)
	}
	await Promise.all(promises);
	console.log(`Finished task taskTwo`);
}


// Task 3. Repeat Task 1 (use `taskThree_[fileNumber]` for the filesNames) except some tasks should be written to a directory `notHome` that does not exist instead of the output directory.
// These failures should be set to occur 30% of the time on average at random.
// When a failure occurs log `File [fileNumber] failed to write` to the console.
// The rest of the writes should continue in order and succeed.
// One task selected at random should also have a 5 second delay introduced before the write occurs.
// Log `Starting 5s delay at [unix timestamp]` when starting and `Ending 5s delay at [unix timestamp]` when completing.
const generateRandom = (range) => {
	let val = Math.floor(Math.random() * range);
	return val;
}
const setDelay = async (fileName) => {
	console.log(`Starting 5s delay at ${Date.now()}`)

	let promise = new Promise((resolve, reject) => {
    	setTimeout(() => resolve(writeTo(fileName)), 5000)
  	});

    await promise;
	console.log(`Ending 5s delay at ${Date.now()}`)
}

const taskThree = async (reps) => {
	console.log(`Starting task taskThree`);
	let failDecision; 
	let delayDecision = generateRandom(reps);

	for (let i = 0; i < reps; i++) {
		const test = generateRandom(reps);
		let fileName = `taskThree_${i}`;
		if (i === test) failDecision = false;
		try {
			console.log("test: ", delayDecision, i);
			if (i === delayDecision) {
				setDelay(fileName)
			} else {
				console.log(`Creating file ${fileName}`);
				await writeTo(fileName, failDecision);
				console.log(`Finished creating ${fileName}`);
			}
		} catch (err) {
				console.error(err);
			}
	}
	console.log(`Finished task taskThree`);
}


async function app() {
	const numOfFiles = parseInt(date.slice(-1)); 
	const filePath = `${directoryPath}/${date}`;

	fs.mkdir(filePath, (err) => {
  		if (err) throw err;
	});

	await taskOne(numOfFiles);
	await taskTwo(numOfFiles);
	await taskThree(numOfFiles);



};

app()
	.catch(e => console.error(e));

