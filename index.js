const express = require('express');
const app = express();
const port = 80;
const apiRouter = require('./routes/api');
const path = require('path');
const fs = require('fs/promises');
const HTMLParser = require('node-html-parser');
const { JSDOM } = require("jsdom");

const frontendBuildPath = path.join(__dirname, './front-end-app/build');
const FRONT_END_FILE_INDEX = path.join(__dirname, './front-end-app/build/index.html');
// API route handler
app.use('/api/v1', apiRouter);

// Static file directory
app.use(express.static(frontendBuildPath));


function generateMetaTag(property, content) {
    const dom = new JSDOM();
    const metaTag = dom.window.document.createElement('meta');
    metaTag.setAttribute('property', property);
    metaTag.setAttribute('content', content);
    return metaTag;
}

{/* <meta property="og:type" content="business.business" />
<meta property="og:title" content="&#128205; Signature REP" />
<meta property="og:description" content="Signature Real Estate Professionals is the Southeast's premiere real estate agency. We provide our clients with the best service up front. From buying and selling homes, to rentals and more, we have all of your real estate needs covered." />
<meta property="og:image" content="{{imageUrl}}" />
<meta property="og:url" content="https://signaturerep.com" /> */}

// Custom path for dedicated SEO
app.get('/contact', async (req, res) => {

    try {
        const file = await fs.readFile(FRONT_END_FILE_INDEX, 'utf8');
        const root = new JSDOM(file);
        const head = root.window.document.getElementsByTagName('head');

        const tag1 = generateMetaTag('og:title', 'Sukhdeep Singh')
        const tag2 = generateMetaTag('og:description', 'Some descriptiong about name sukhdeep singh');
        const tag3 = generateMetaTag('og:image', 'https://fastly.picsum.photos/id/885/200/200.jpg?hmac=RQ5YecoOv-yZMfoibCEw6EjqLgnpWvSrGEQmkcoAdaw');

        console.log(tag1);
        console.log(tag2);
        console.log(tag3);

        if (head && head.length) {
            head[0].appendChild(tag1);
            head[0].appendChild(tag2);
            head[0].appendChild(tag3);
            console.log(root.serialize(), '-----');
            res.setHeader("Content-Type", "text/html");
            res.send(root.serialize());
        } else {
            res.sendFile(FRONT_END_FILE_INDEX);
        }


    } catch (err) {
        console.error(err);
        res.sendFile(FRONT_END_FILE_INDEX);
    }
})

// Serving Index file when front-end reloads
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, './front-end-app/build/index.html'));
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({ error: 'Something failed!' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})