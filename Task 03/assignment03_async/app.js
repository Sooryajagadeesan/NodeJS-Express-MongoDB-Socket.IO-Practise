const http = require("http")
const fs = require("fs")
const async = require("async");

// to calculate the execution time of a function
const {performance} = require("perf_hooks")

const PORT = 8080;
const server = http.createServer((req,res) => {
    const query = req.url;

    res.setHeader('Content-Type','text/html');
    
    // CALL BACK HELL
    if (query === '/' || query === "/callback") {
        res.write(`<h1><u>Using CALLBACKS</u></h1>`);
        fs.readFile('./assets/textFiles/file01.txt',(err, data) => {
            if (err) {
                res.end(`<h1>Error while reading file 01</h1><br><p>${err}</p>`);
                console.log("ERROR while reading file 01");
            } else {
                res.write(`<h2>${data}</h2>`);
                fs.readFile("./assets/textFiles/file02.txt", (err,data) => {
                    if (err) {
                        res.end(`<h1>Error while reading file 02</h1><br><p>${err}</p>`);
                        console.log("ERROR while reading file 02");
                    } else {
                        res.write(`<h2>${data}</h2>`);
                        fs.readFile("./assets/textFiles/file03.txt", (err, data) => {
                            if (err) {
                                res.end(`<h1>Error while reading file 03</h1><br><p>${err}</p>`);
                                console.log("ERROR while reading file 03");
                            } else {
                                res.write(`<h2>${data}</h2>`);
                                fs.readFile("./assets/textFiles/file04.txt", (err, data) => {
                                    if (err) {
                                        res.end(`<h1>Error while reading file 04</h1><br><p>${err}</p>`);
                                        console.log("ERROR while reading file 04");
                                    } else {
                                        res.write(`<h2>${data}</h2>`);
                                        fs.readFile("./assets/textFiles/file05.txt", (err, data) => {
                                            if (err) {
                                                res.end(`<h1>Error while reading file 05</h1><br><p>${err}</p>`);
                                                console.log("ERROR while reading file 05");
                                            } else {
                                                res.write(`<h2>${data}</h2>`);
                                                fs.readFile("./assets/textFiles/file06.txt", (err, data) => {
                                                    if (err) {
                                                        res.end(`<h1>Error while reading file 06</h1><br><p>${err}</p>`);
                                                        console.log("ERROR while reading file 06");
                                                    } else {
                                                        res.write(`<h2>${data}</h2>`);
                                                        fs.readFile("./assets/textFiles/file07.txt",(err, data) => {
                                                            if (err) {
                                                                res.end(`<h1>Error while reading file 07</h1><br><p>${err}</p>`);
                                                                console.log("ERROR while reading file 07");
                                                                
                                                            } else {
                                                                res.write(`<h2>${data}</h2>`);
                                                                fs.readFile("./assets/textFiles/file08.txt",(err, data) => {
                                                                    if (err) {
                                                                        res.end(`<h1>Error while reading file 08</h1><br><p>${err}</p>`);
                                                                        console.log("ERROR while reading file 08");
                                                                        
                                                                    } else {
                                                                        res.write(`<h2>${data}</h2>`);
                                                                        fs.readFile("./assets/textFiles/file09.txt", (err, data) => {
                                                                            if (err) {
                                                                                res.end(`<h1>Error while reading file 09</h1><br><p>${err}</p>`);
                                                                                console.log("ERROR while reading file 09");

                                                                            } else {
                                                                                res.write(`<h2>${data}</h2>`);
                                                                                fs.readFile("./assets/textFiles/file10.txt", (err, data) => {
                                                                                    if (err) {
                                                                                        res.end(`<h1>Error while reading file 10</h1><br><p>${err}</p>`);
                                                                                        console.log("ERROR while reading file 10");

                                                                                    } else {
                                                                                        res.write(`<h2>${data}</h2>`);
                                                                                        res.end();
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    } else if (query === "/parallel") {
        res.write(`<h1><u>Using Async Parallel</u></h1>`);
        let start = performance.now();
        readAsyncParallel(res);
        let end = performance.now();
        res.write(`<h3>Time Taken : ${end-start}</h3>`)
    } else if (query === "/series") {
        res.write(`<h1><u>Using Async Series</u></h1>`);
        let start = performance.now();
        readAsyncSeries(res);
        let end =  performance.now();
        res.write(`<h3>Time Taken : ${end-start} </h3>`);
    } else if (query === "/waterfall") {
        res.write(`<h1><u>Async Waterfall - check the text files, below is the content from the last (10th) file</u></h1>`);
        readAsyncWaterfall(res);
    } else if (query === "/reset") {
        files = ["file01","file02","file03","file04","file05","file06","file07","file08","file09","file10"];
        files.forEach((file) => {
            fs.readFile(`./assets/waterfallFiles/${file}.txt`, (err, data) => {
                if (err) {
                    res.end(`ERROR while trying to reset the text files`);
                    console.log("ERROR while resetting data");
                } else {
                    data = data.toString().split('\n');
                    fs.writeFileSync(`./assets/waterfallFiles/${file}.txt`,data[0]);
                }
            })
        })
        res.write(`<h2>Reset Successful</h2>`);
        res.end();
    }
})

server.listen(PORT, ()=> console.log(`Server is running at ${PORT}`));


// function to read, read and append data.
// previousData argument is given only when we are APPENDING data.
function parsePlusAppendFile(file,callback,previousData = null) {
    fs.readFile(file,(err, data) => {
        if (err) {
            callback(err,null);
        } else {
            // this part is executes only when 'previousData' is passed
            if (previousData) {
                fs.appendFileSync(file, '\n' + previousData.toString());
                data = data.toString() + '\n' + previousData.toString();
            }
            callback(null, data);
        }
    })
}

// ASYNC parallel
function readAsyncParallel(res) {
    async.parallel([
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file01.txt",callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file02.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file03.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file04.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file05.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file06.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file07.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file08.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file09.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file10.txt", callback);
        }
    ], function(err, result){
        if (err) {
            res.end(`ERROR : <h1>${err}</h1>`);
        } else {
            for (let content of result) {
                res.write(`<h2>${content}<h2>`);
            }
            res.end();
        }
    })
}

// ASYNC series
function readAsyncSeries(res) {
    async.series([
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file01.txt",callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file02.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file03.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file04.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file05.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file06.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file07.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file08.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file09.txt", callback);
        },
        function (callback) {
            parsePlusAppendFile("./assets/textFiles/file10.txt", callback);
        }
    ], function(err, result){
        if (err) {
            res.end(`ERROR : <h1>${err}</h1>`);
        } else {
            for (let content of result) {
                res.write(`<h2>${content}<h2>`);
            }
            res.end();
        }
    })
}

// ASYNC waterfall
function readAsyncWaterfall(res) {
    async.waterfall([
        function (callback) {
            parsePlusAppendFile("./assets/waterfallFiles/file01.txt",callback);
        },
        function (previousData, callback) {
            parsePlusAppendFile("./assets/waterfallFiles/file02.txt",callback,previousData);
        },
        function (previousData, callback) {
            parsePlusAppendFile("./assets/waterfallFiles/file03.txt",callback,previousData);
        },
        function (previousData, callback) {
            parsePlusAppendFile("./assets/waterfallFiles/file04.txt",callback,previousData);
        },
        function (previousData, callback) {
            parsePlusAppendFile("./assets/waterfallFiles/file05.txt",callback,previousData);
        },
        function (previousData, callback) {
            parsePlusAppendFile("./assets/waterfallFiles/file06.txt",callback,previousData);
        },
        function (previousData, callback) {
            parsePlusAppendFile("./assets/waterfallFiles/file07.txt",callback,previousData);
        },
        function (previousData, callback) {
            parsePlusAppendFile("./assets/waterfallFiles/file08.txt",callback,previousData);
        },
        function (previousData, callback) {
            parsePlusAppendFile("./assets/waterfallFiles/file09.txt",callback,previousData);
        },
        function (previousData, callback) {
            parsePlusAppendFile("./assets/waterfallFiles/file10.txt",callback,previousData);
        }
    ],(err,result) => {
        if (err) {
            res.end(`ERROR : ${err}`);
        } else {
            wholeContent = result.split('\n');
            for (let content of wholeContent) {
                res.write(`<h2>${content}</h2>`);
            }
            res.end();
        }
    })
}






