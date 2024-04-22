const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    let filee = [];
    fs.readdir('./files', (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            const rmtxt = path.parse(file).name;
            const syncFile = fs.readFileSync(`./files/${file}`, 'utf-8')
            filee.push({files: rmtxt, content: syncFile});
        } )
        res.render('index', {filee});
    })
})

//Read-->

app.get('/show/:filename', (req, res) => {
    const addEXt = req.params.filename + '.txt';
    fs.readFile(`./files/${addEXt}`, 'utf-8' ,(err,files) => {
        if (err) return console.log(err);
        else res.render('show', {filestitle: req.params.filename, filedata: files});
    })
})

//create-->

app.post('/create', (req, res) => {
    const title = req.body.title.split(' ').join('') + '.txt';
        fs.writeFile(`./files/${title}`, req.body.description, (err, data) => {
            if(err) return err
            else res.redirect('/')
        })

});

// delete-->

app.get('/remove/:rmfile', (req, res) => {
    const addExtrm = req.params.rmfile + '.txt';
    fs.unlink(`./files/${addExtrm}`, err => {
        if(err) console.log(err);
        res.redirect('/')
    })
})


//update--->

app.get('/edit/:edfile', (req, res) => {
    let filee = [];
    fs.readdir('./files', (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            const rmtxt = path.parse(file).name;
            const syncFile = fs.readFileSync(`./files/${file}`, 'utf-8')
            filee.push({files: rmtxt, content: syncFile});
        } )
        res.render('edit', {filee: filee, filename: req.params.edfile,});
    })
})

app.post('/edit', (req, res) => {
    const prename = req.body.previous + '.txt';
    const newtitle = req.body.title + '.txt';
    fs.rename(`./files/${prename}`, `./files/${newtitle}`, err => {
        if (err) throw err;
        fs.writeFile(`./files/${prename}`, req.body.description, err => {
            if (err) throw err;
            res.redirect('/')
        });
    })
})

app.listen(3000)