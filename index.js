const express=require('express')
const app=express();
PORT=8080;
app.get('/',(req,res)=>{
res.send("hello World");
});
app.listen(PORT, () => { 
    console.log(`The code is running on port http://localhost:${PORT}`);
});