const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) throw err;
        const rmtxt = files.map(file => path.parse(file).name);
        res.render('index', {files: rmtxt});
    })
})
app.get('/show/:filename', (req, res) => {
    const addEXt = req.params.filename + '.txt';
    fs.readFile(`./files/${addEXt}`, 'utf-8' ,(err,files) => {
        if (err) return console.log(err);
        else res.render('show', {filestitle: req.params.filename, filedata: files});
    })
})
app.post('/create', (req, res) => {
    const title = req.body.title.split(' ').join('') + '.txt';
        fs.writeFile(`./files/${title}`, req.body.description, (err, data) => {
            if(err) return err
            else res.redirect('/')
        })

});
app.get('/remove/:rmfile', (req, res) => {
    const addExtrm = req.params.rmfile + '.txt';
    fs.unlink(`./files/${addExtrm}`, err => {
        if(err) console.log(err);
        res.redirect('/')
    })
})

app.listen(3000)