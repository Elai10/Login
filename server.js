const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())
app.use(express.static(__dirname + '/public'));

const users = []

app.get('/', function(req, res){
    console.log(__dirname)
    res.sendFile(__dirname + '/index.html');
});

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', async (req,res) => {
    try{
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {name: req.body.name, password: hashedPassword}
        users.push(user)
        
        res.status(200).send({
            body:user
        })      
    } catch(e) {
        console.log(req.body)
        res.status(500).send(e)
    }

    
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name == req.body.name)

    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
       if(await bcrypt.compare(req.body.password, user.password)) {
        res.send('Success')
       } else {
        res.send('User password wrong')
       }
    } catch(e) {
        res.status(500).send(e)
    }
})

app.listen(3000)