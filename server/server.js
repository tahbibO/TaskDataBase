const express = require('express')

const cors = require('cors')
const PORT = process.env.PORT || 3001
const dbConnection = require('./dbConnection')
const path = require('path')

let app = express();

app.use(cors({origin: 'http://localhost:3000'}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get("/api",(req,res)=>{
    
    res.json({message: "Hello from server!"})
    console.log("here")
})

app.get("/persons", dbConnection.getPersons)
app.get("/persons/:pid",dbConnection.getPerson)
app.get("/tasks",dbConnection.getTasks)
app.get("/tasks/:tid",dbConnection.getTask)
app.get("/sessions",dbConnection.getSessions)
app.get("/sessions/:sid",dbConnection.getSession)

app.get("/",(req,res)=>{
    res.render('index.pug')
})





app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/`);
});

