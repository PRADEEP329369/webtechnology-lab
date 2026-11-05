
const http = require('http');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const url = "mongodb://127.0.0.1:27017/";

const client = new MongoClient(url);

async function startServer() {

    await client.connect();

    console.log("MongoDB Connected Successfully");

    const db = client.db("registrationDB");
    const collection = db.collection("users");

    const server = http.createServer(async (req, res) => {

        if (req.url === '/' && req.method === 'GET') {

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            fs.createReadStream('./home.html').pipe(res);

        }

        else if (req.url === '/server' && req.method === 'POST') {

            let rawData = '';

            req.on('data', function(data) {
                rawData += data;
            });

            req.on('end', async function() {

                try {

                    const input = new URLSearchParams(rawData);

                    const user = {
                        name: input.get('name'),
                        password: input.get('password'),
                        age: input.get('age'),
                        mobile: input.get('mobile'),
                        email: input.get('email'),
                        gender: input.get('gender'),
                        state: input.get('state'),
                        skills: input.getAll('skills')
                    };

                    // Store data in MongoDB
                    await collection.insertOne(user);

                    // Retrieve data from MongoDB
                    const users = await collection.find().toArray();

                    // Display submitted details
                    let html = `
                    <html>
                    <body>
                    <h2 style="color:blue">
                    User Submitted Details
                    </h2>

                    <table border="1" cellpadding="10">
                    <tr>
                    <th>Field</th>
                    <th>Details</th>
                    </tr>
                    `;

                    for (const u of users) {

                        html += `
                        <tr><td>Name</td><td>${escapeHTML(u.name)}</td></tr>
                        <tr><td>Password</td><td>${escapeHTML(u.password)}</td></tr>
                        <tr><td>Age</td><td>${escapeHTML(u.age)}</td></tr>
                        <tr><td>Mobile Number</td><td>${escapeHTML(u.mobile)}</td></tr>
                        <tr><td>Email</td><td>${escapeHTML(u.email)}</td></tr>
                        <tr><td>Gender</td><td>${escapeHTML(u.gender)}</td></tr>
                        <tr><td>State</td><td>${escapeHTML(u.state)}</td></tr>
                        <tr><td>Skills</td><td>${u.skills.map(escapeHTML).join(', ')}</td></tr>
                        `;
                    }

                    html += `
                    </table>
                    </body>
                    </html>
                    `;

                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    });

                    res.end(html);

                } catch (error) {

                    console.log(error);

                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                    });

                    res.end("Error processing registration");

                }

            });

        }

        else {
            res.writeHead(404);
            res.end("Page Not Found");
        }

    });

    server.listen(6000, function() {
        console.log("Server running at http://localhost:6000");
    });

}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char];
    });
}

startServer().catch(console.error);
