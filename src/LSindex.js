const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongo");
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');

app.set('views', templatePath);

app.get('/signup', (req, res) => {
    res.sendFile(path.join(templatePath, 'signup.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(templatePath, 'login.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(templatePath, 'index.html'));
});

app.use(express.static(publicPath));

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking && checking.name === req.body.name && checking.password === req.body.password) {
            res.send("User details already exist");
        } else {
            await LogInCollection.insertMany([data]);
            res.status(201).sendFile(path.join(templatePath, 'Homeindex.html'));
        }
    } catch {
        res.send("Wrong inputs");
    }
});

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (check && check.password === req.body.password) {
            res.status(201).sendFile(path.join(templatePath, 'Homeindex.html'));
        } else {
            res.send("Incorrect password");
        }
    } catch (e) {
        res.send("Wrong details");
    }
});



app.listen(port, () => {
    console.log('Server is running on port', port);
});
