const fs = require('fs');
var path = require('path');


const isPathCorrect = () => { 
    let chance =  Math.floor(Math.random()*Math.floor(10)+1) 
    return chance < 7 ? true : false
}



function writeFileAsync(directory, file){
    return new Promise( (resolve,reject) => {
        console.log(`Writing File ${file}`)
        fs.writeFile(path.join(directory,file), 'this is a file', (err) => {
            if(err){
                reject(err)
            } else{
                resolve()
            }
        })
    })
}

function writeFileAsyncRetry(file, timeout = 250,retries = 0){
    let l = isPathCorrect() ? __dirname : path.join(__dirname,`/notHome`)
    return new Promise( (resolve,reject) => {
        console.log(`Writing File ${file}`)
        fs.writeFile(path.join(l,file), 'this is a file', (err) => {
            if(err){
                console.log(`Retrying writing ${file}`)
                retries ++;
                timeout = timeout*retries
                setTimeout(()=> {
                    writeFileAsyncRetry(file,timeout,retries)
                }, timeout)
            } else{
                resolve()
            }
        })
    })
}

function delayFiveSec(condition){
    if(condition === true){
        return new Promise(resolve => {
            console.log(`** Starting 5s delay at ${Date.now()} **`);
            setTimeout(() => {
                console.log(`** Ending 5s delay at ${Date.now()} **`)
                resolve()
            }, 5000)
        });
    }
    else {
        return Promise.resolve()
    }
}

function randomlyDelayIndex(x){
    return Math.floor(Math.random()*Math.floor(x+1));
}

async function taskOne(x, location){
    console.log('** Starting task task One **')
    for(var i = 1; i <= x; i++) {
        let name = `taskOne_${i}`;
        await writeFileAsync(location,name)
        console.log(`Finished Writing file ${name}`)
    }
    console.log('** Finished with task One **')
}

async function taskTwo(x, location){
    console.log('** Starting task Two **')
    const filesToWrite = []
    for(var i = 1; i <= x; i++){
        let name = `taskTwo_${i}`
        filesToWrite.push(
            writeFileAsync(location, name)
            .then( () => console.log(`Finished Writing file taskTwo_${name}`)))
    }
    await Promise.all(filesToWrite)
    console.log(`** Finished with task Two **`)
}

async function taskThree(x, location){
    console.log('** Starting task Three **')
    const delayedIndex = randomlyDelayIndex(x);

    for(var i = 1; i <= x; i++){
        let name = `taskThree_${i}`;
        let l = isPathCorrect() ? location : path.join(__dirname,`/notHome`);

        await delayFiveSec(i === delayedIndex)
        try {
            await writeFileAsync(l, name)
            console.log(`Finished Writing file ${name}`)
        }
        catch(e){
            console.log(`Failed to write file ${name}`)
        }
    }
    console.log(`** Finished with task Three **`)
}

async function taskFour(x, location){
    console.log(`** Starting task Four **`)
    const delayedIndex = randomlyDelayIndex(x);
    const filesToWrite = []

    for(var i = 1; i <= x; i++){
        let name = `taskFour_${i}`
        let l = isPathCorrect() ? location : path.join(__dirname,`/notHome`);

        filesToWrite.push(
            delayFiveSec(i === delayedIndex)
            .then( () => {return writeFileAsync(l,name)})
            .then( () => console.log(`Finished Writing file ${name}`))
            .catch( (err) => console.log(`Failed to write ${name}`))
        )
    }
    await Promise.all(filesToWrite)
    console.log(`** Finished with taskFour **`)
}


async function taskFive(x,location){
    console.log('** Starting task Five **')
    const delayedIndex = randomlyDelayIndex(x);
    for(var i = 1; i <= x; i++){
        let name = `taskFive_${i}`;
        let l = isPathCorrect() ? location : path.join(__dirname,`/notHome`);
        await delayFiveSec(() => i === delayedIndex)
        try {
            await writeFileAsync(l, name)
            console.log(`Finished Writing file ${name}`)
        }
        catch(e){
            console.log(`Failed to write file ${name}`)
            break;
        }
    }
    console.log(`** Finished with task Five **`)
}

async function taskSix(x, location){
    console.log(`** Starting task Six **`)
    const delayedIndex = randomlyDelayIndex(x);
    const filesToWrite = []

    for(var i = 1; i <= x; i++){
        let name = `taskSix_${i}`
        let l = isPathCorrect() ? location : path.join(__dirname,`/notHome`);

        filesToWrite.push(
            delayFiveSec(i === delayedIndex)
            .then( () => { writeFileAsync(l,name)
                .then( () => console.log(`Finished Writing file ${name}`))
            })
        )
    }
    await Promise.all(filesToWrite).catch( (err) => console.log(`Task 6 Failed`))

    console.log(`** Finished with taskSix **`)
}

async function taskSeven(x, location){
    console.log('** Starting task Seven **')
    const delayedIndex = randomlyDelayIndex(x);

    for(var i = 1; i <= x; i++){
        let name = `taskSeven_${i}`;
        let l = isPathCorrect() ? location : path.join(__dirname,`/notHome`);

        await delayFiveSec(i === delayedIndex)
        try {
            await writeFileAsyncRetry(name)
            console.log(`Finished Writing file ${name}`)
        }
        catch(e){
            console.log(`Failed to write file ${name}`)
        }
    }
    console.log(`** Finished with task Seven **`)
}

async function main(){
    const folderName = String(Date.now());
    const x = Number(folderName.slice(-1));
    const location = path.join(__dirname,folderName);
    fs.mkdir(location, ()=> {});
taskThree(8,location)
    // taskOne(7, location)
    // .then(() => taskTwo(7,location))
    // .then(() => taskThree(8,location))
    // // .then( () => taskFour(7, location))
    // // .then( () => taskFive(7,location))
    // // .then( () => taskSix(7,location))
    // .catch(console.error)
}


main();