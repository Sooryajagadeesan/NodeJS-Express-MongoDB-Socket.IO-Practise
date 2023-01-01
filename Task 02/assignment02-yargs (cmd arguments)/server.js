// const { string } = require('yargs');
const yargs = require('yargs');
const http = require("http");
const chalk = require("chalk");
const fs = require("fs");
const formidable = require("formidable");
const writer = require('./writer');

// server
const port = 8080;
const server = http.createServer((req,res) => {
    const query = req.url;
    res.setHeader('Content-Type','text/html');
    // Form data handling
    if (query === '/api/formdata') {
        const form = formidable();
        form.parse(req, (err, fields,files) => {
            if (err) {
                console.log("ERROR while parsing the form data",err);
            } else {
                const formType = fields["form-heading"];
                let index = writer.findIndex(fields.heading);

                // processing is done based on the type of form
                if (formType === "ADD FORM") {
                    if (index === false) {
                        writer.populateArray(fields.heading, fields.description);
                        writer.addDataToFile();
                        res.write("<h1>DATA ADDED SUCCESSFULLY</h1>");
                    } else {
                        res.write("<h1>CANNOT ADD DUPLICATES, Data ALREADY EXISTS</h1>");
                    }
                } else if (formType === "REMOVE FORM") {
                    if (index === false) {
                        res.write("<h1>CAN'T REMOVE, NO SUCH DATA</h1>");
                    } else {
                        writer.removeByIndex(index);
                        writer.addDataToFile();
                        res.write("<h1>DATA REMOVED SUCCESSFULLY</h1>");
                    }

                } else if (formType === "READ FORM") {
                    if (index === false) {
                        res.write("<h1>CAN'T READ, NO SUCH DATA</h1>");
                    } else {
                        let dataObject = writer.readDataByIndex(index);
                        res.write(`<h1>READING DATA SUCCEESSFUL</h1><br>`)
                        res.write(`<h2>HEADING : ${dataObject.heading}</h2>`);
                        res.write(`<h2>DESCRIPTION : ${dataObject.description}</h2>`);
                    }
                }

                res.end();
            }
        })
    }
    // Proceeding as per the request
    else if (query === '/') {
        // res.setHeader('Content-Type',"text/html");
        let content = fs.readFileSync("./webPages/home.html");
        res.write(content);
    }else if (query === '/list') {
        let fileContent = fs.readFileSync("./notes.json").toString();
        try {
            fileContent = JSON.parse(fileContent);
        } catch (err) {
            fileContent = [];
        }

        if (fileContent.length > 0) {
            res.write("<h2>Listing all Data</h2>");
            res.write(`<h1>DATA COUNT : ${fileContent.length}</h1><hr>`)
            for(let i=0;i<fileContent.length;i++) {
                res.write(`<h1>Data Entry : ${i+1}</h1>`);
                res.write(`<h2>Heading : ${fileContent[i].heading}</h2>
                <h2>Description : ${fileContent[i].description}</h2><hr>`);
            }
        } else {
            res.write(`<h1>NO entries, File is empty</h1>`);
        }
        res.end();

    } else {
        res.write("<h1>404 Page Not Found</h1>");
        res.end();
    }
})



// command to add a data entry
yargs.command({
    command: 'add',
    desc: 'add a new note',
    builder : {
        heading: {
            require: true,
            type: 'string'
        },
        description: {
            require: true,
            type: 'string'
        }
    },
    handler (argv) {
        let index = writer.findIndex(argv.heading);
        if (index !== false) {
            console.log(chalk.bgRed("Data already exists, NO DUPLICATES allowed"));
        } else {
            writer.populateArray(argv.heading,argv.description);
            writer.addDataToFile();
            console.log(chalk.bgGreen("Added Successfully"))
        }
    }
})

// command to remove a data entry
yargs.command({
    command: 'remove',
    desc: "Removes a key",
    builder: {
        heading: {
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        let index = writer.findIndex(argv.heading);
        if (index !== false) {
            writer.removeByIndex(index);
            writer.addDataToFile();
            console.log(chalk.bgGreen("Successfully removed"))
        } else {
            console.log(chalk.bgRed("CANNOT REMOVE, NO such heading"));
        }
    }
})

// command to list all the entries from the file
yargs.command({
    command: 'list',
    desc: "Lists all the records",
    handler(argv) {
        writer.listData();
    }
})

// command to read from the file
yargs.command({
    command: 'read',
    desc:"Reads a particular Data",
    builder: {
        heading: {
            require:true,
            type:'string'
        }
    },
    handler(argv) {
        let index=writer.findIndex(argv.heading);
        if (index !== false) {
            console.log(chalk.bgGreen("READ Successful"));
            console.log(writer.readDataByIndex(index));
        } else {
            console.log(chalk.bgRed("CANNOT READ, NO SUCH DATA"));
        }
    }
})


// command to start the server for using the UI
yargs.command({
    command: 'start-server',
    desc: 'Starts a server',
    handler() {
        server.listen(port, ()=> {
            console.log(`Server is running at ${port}`);
        })
    }
})

yargs.argv

