const http = require("http");
const fs = require("fs");
const formidable = require("formidable");
const templateString = require("./webPages/schoolData/school");

const port = 8080;

// my server
const server = http.createServer((req,res) => {
    // console.log('URL message ',req.url)
    const query = req.url;

    // a backend route, this is requested when the upload form is submitted
    if (query=== "/api/fileupload"){
        const form = formidable( { uploadDir : __dirname + "\\allFiles"});
        form.parse(req, (err,fields,files)=> {
            if (err) {
                res.writeHead(400, {'Content-Type':'text/plain'});
                res.write('ERROR in parsing the uploaded file', err)
            } else {
                fs.rename(files.file.filepath, __dirname+"\\allFiles\\"+files.file.originalFilename, (err)=> {
                    if (err) {
                        console.log("Error while renaming the uploaded file",err);
                    }
                });
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write('<h1>Your File Uploaded Successfully</h1>');
            }
            res.end();
        })
        return;
    }

    // Proceeding as per the url requested
    if (query === '/') {
        sendResponse('./webPages/home/home.html',res);
    } else if (query === "/admin") {
        sendResponse('./webPages/admin/admin.html',res);
    } else if (query === "/school") {
        res.setHeader('Content-Type','text/html');
        res.writeHead(200);
        res.write(templateString);
        res.end();
    } else if (query === "/fileupload") {
        sendResponse("./webPages/upload/index.html",res);
    }
     else {
        res.setHeader('Content-Type','text/html');
        res.writeHead(404);
        res.write('<h1>404 Page Not Found</h1>')
        res.end();
    }
})

// sends response
function sendResponse(file,res) {
    fs.readFile(file,(err, data) => {
        res.setHeader('Content-Type','text/html');
        res.writeHead(200,'Custom Status Message : OK'); 
        if (err) {
            console.log("Error while reading the html file", err);
        } else {
            res.write(data);
        }
        res.end();
    })
}


server.listen(port, () => {
    console.log(`Server is running in port ${port}`)
})