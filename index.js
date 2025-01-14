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

//working with json data 
//return json data 
app.get('/api/user',(req,res)=>{
    res.json(users);
    });

// app.get("/api/user/:id",(req,res)=>{ ///api/users/:id  this id is user defined and prams id is same 
//     const id=Number(req.params.id)
//     const user = users.find((user) => user.id === id);
//     return res.json(user);
// })
//  app.post("/api/user/",(req,res)=>{
//     // todo to create a user 
//     return res.json({status:"Pending"})
//  })

//  app.patch("/api/user/",(req,res)=>{
//     // todo to edit a user  with id
//     return res.json({status:"Pending"})
//  })

//  app.delete("/api/user/",(req,res)=>{
//     // todo to Delete a user 
//     return res.json({status:"Pending"})
//  })

app.route('/api/user/:id').get((req,res)=>{
    const id=Number(req.params.id)
    const user = users.find((user) => user.id === id);
    return res.json(user);
})
.post((req,res)=>{
    // todo to create a user 
    return res.json({status:"Pending"})
 })
.patch((req,res)=>{
    // todo to edit a user  with id
    return res.json({status:"Pending"})
 })
 .delete((req,res)=>{
    // todo to Delete a user 
    return res.json({status:"Pending"})
 })

app.listen(PORT, () => { 
    console.log(`The code is running on port http://localhost:${PORT}`);
});