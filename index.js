const express = require('express');
const app = express();
const fs=require('fs');
const PORT = 8080; // 
const users = require('./MOCK_DATA.json');
const { json } = require('body-parser');

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));  //middleman 1

app.use((req, res, next) => {
    const logEntry = `${Date.now()}: ${req.ip}: ${req.method}: ${req.url}\n`;
    fs.appendFile('./log.txt', logEntry, (err) => {
        if (err) {
            console.error("Failed to write to log file:", err);
        }
        next();
    });
});

app.use((req,res,next)=>{                           //middleman 3
    console.log("hello from middle 2 ",req.myusername)
    next();
})
//note==> middleman aways start from top to button

// Routes
app.get('/', (req, res) => {
    console.log("I am in get route",req.myusername);
    res.send("<h1>Welcome to Homepage</h1>");

});

app.get('/about', (req, res) => {
    res.send("<h1>Welcome to About Page</h1>");
});

app.get('/hello', (req, res) => {
    res.send("Hello World");
});

// User route to return an HTML list of user first names
app.get('/user', (req, res) => {
    const html = `
    <ul>
        ${users.map((user) => {
            return `<li>${user.first_name}</li>`;
        }).join("")}
    </ul>
    `;
    res.send(html);
});

// Return JSON data
app.get('/api/user', (req, res) => {
    res.json(users);
});

// Route with multiple HTTP methods
app.route('/api/user/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        if (!user) {
            return res.status(404).json({ error: "User not found..." });
        }
       
        return res.json(user);
    })
    .post((req, res) => {
        const body = req.body;
        return res.json({ status: "Pending "}); 
    })
    .patch((req, res) => {
        const body = req.body;
        console.log("Body for update:", body);
        return res.json({ status: "User updated", body });
    })
    .delete((req, res) => {
        return res.json({ status: "User deleted" });
    });

// POST route to create a user
app.post('/api/user', (req, res) => {
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender){
        return res.status(400).json({msg: "All field are require..."});
    }
    users.push({ ...body, id: users.length + 1 });

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ status: "Error", message: err.message });
        }
        res.status(201).json({ status: "Success", id: users.length });

    });
    console.log("Body",body);
});

// Start the server
app.listen(PORT, () => {
    console.log(`The code is running on port http://localhost:${PORT}`);
});
