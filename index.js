const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');


const app = express();
const fs=require('fs');
const PORT = 8080; // 
const users = require('./MOCK_DATA.json');
const { json } = require('body-parser');


// Database connection
mongoose.connect('mongodb://localhost:27017/NMB')
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch(err => console.error("Failed to connect to MongoDB:", err));




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
app.get('/user', async(req, res) => {
    const allDbUser=await User.find({});
    const html = `
    <ul>
        ${allDbUser.map((user) => {
            return `<li>${user.first_name}-${user.email}</li>`;
        }).join("")}
    </ul>
    `;
    res.send(html);
});

// Return JSON data
app.get('/api/user', async(req, res) => {
    const allDbUser = await User.find({}); // Fetch all users
    res.status(200).json(allDbUser);
});

// Route with multiple HTTP methods
app.route('/api/user/:id')
    .get(async(req, res) => {
        // const id = Number(req.params.id);
        // const user = users.find((user) => user.id === id);
        const user =await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ error: "User not found..." });
        }
       
        return res.json(user);
    })
    .post((req, res) => {
        const body = req.body;
        return res.json({ status: "Pending "}); 
    })
    .patch( async(req, res) => {
        // const body = req.body;
        // console.log("Body for update:", body);
        // return res.json({ status: "User updated", body });
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{last_name:"Kiki"})
        console.log(updatedUser);
        return res.json({status:"Sucssfully Changeed"});
    })
    .delete((req, res) => {
        return res.json({ status: "User deleted" });
    });

// POST route to create a user
app.post('/api/user', async(req, res) => {
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender){
        return res.status(400).json({msg: "All field are require..."});
    }

   
    // users.push({ ...body, id: users.length + 1 });
    // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    //     if (err) {
    //         return res.status(500).json({ status: "Error", message: err.message });
    //     }
    //     res.status(201).json({ status: "Success", id: users.length });
    // });
    // console.log("Body",body);

     // to insert data into MOCK_DATA.json
     const result=await User.create({
        first_name:body.first_name,
        last_name:body.last_name,
        email:body.email,
        gender:body.gender

    })
    console.log(result);
    return res.status(201).json({msg:"User Creater"})

});
//rest api 
// app.get("/api/user",async(req,res)=>{
//     const allDbUser = await User.find({}); // Fetch all users
//     res.status(200).json(allDbUser);
//     res.setHeader("X-MyName","Shadoow");
   
// })

// Start the server
app.listen(PORT, () => {
    console.log(`The code is running on port http://localhost:${PORT}`);
});
