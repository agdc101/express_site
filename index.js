const express = require('express');
const app = express();
const data = require('./data.json');
app.set('view engine', 'pug');
app.use('/', express.static('public'));

app.listen(3000, () => {
    console.log('app is running');
});

app.get('/', (req, res) => {
    res.locals.projects = data.projects;
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/project/:id', (req, res) => {
    let {id} = req.params;
    res.render('project', { project: data.projects[id] });
});

//-- ERROR HANDLERS --//

//-- 404 ERROR
app.use((req, res) => {
    const err = new Error('Page Not Found!');
    err.status = 404;
    res.status(404).render('page-not-found', { err });
});

//--GENERAL ERROR HANDLER
app.use((req, res, err, next) => {
    if (err.status === 404) {
        res.status(404).render('page-not-found', { err });
    } else {
        err.message = err.message || 'Whoops! There was an error on the server!';
        if (err.status === undefined){
            err.status = 500;
        }
        res.status(err.status).render('error', { err } );
    }
});