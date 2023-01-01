const students = require("./student");

let templateString = `
    <html>
        <head>
            <title>students data</title>
            <style>
                table,td,th {
                    border: 2px solid black;
                    border-collapse : collapse;
                    text-align: center;
                }
                h1 {
                    text-align: center;
                }
                .container {
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    justify-content : center;
                    align-items: center;
                }
            </style>    
        </head>
        <body>
            <h1>Student Details</h1>
            <div class="container">
                <table width="50%">
                    <tr>
                        <th>Name</th>
                        <th>DOB</th>
                        <th>Specialisation</th>
                    </tr>
`

for (let student of students) {
    let specialization = student.specialization.toString();
    templateString += `<tr>
        <td>${student.name}</td>
        <td>${student.dob}</td>
        <td>${specialization}</td>
    <tr>`
}

templateString += `
            </table>
        </div>
    </body>
</html> `

module.exports = templateString;