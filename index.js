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
    let { id } = req.params;
    if(isNaN(id) || id > data.projects.length - 1) {
        res.redirect('/project'); // redirects user to produce a 404 error if the query does not match a project
    }
    res.render('project', { project: data.projects[id] });
});

//-- ERROR HANDLERS --//

//-- 404 ERROR
app.use((req, res) => {
    const err = new Error('Page Not Found!');
    err.status = 404;
    console.error(err.message, err.status);
    res.status(404).render('page-not-found', { err });
});

//-- GENERAL ERROR HANDLER
app.use((err, req, res, next) => {   
    err.status = err.status || 500;
    err.message = err.message || 'Server Error';
    if (err.status === 404) {
        res.status(404).render('page-not-found', { err });
    } else {
        res.status(err.status).render('error', { err });
    }
});