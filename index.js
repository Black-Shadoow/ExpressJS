const express=require('express')
const app=express();
PORT=8080;
const users=require('./MOCK_DATA.json');


//rout
app.get('/', (req, res) => {
    res.send("<h1>Welcome to Homepage</h1>");
});
app.get('/about', (req, res) => {
    res.send("<h1>Wellcome TO About Page</h1>");
});

app.get('/hello',(req,res)=>{
    res.send("hello World");
    });

//return json data 
app.get('/api/user',(req,res)=>{
    res.json(users);
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
    
    res.send(html); // Send the constructed HTML as a response
});




app.listen(PORT, () => { 
    console.log(`The code is running on port http://localhost:${PORT}`);
});