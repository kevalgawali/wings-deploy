const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Serve sitemap.xml
router.get('/sitemap.xml', (req, res) => {
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    
    fs.readFile(sitemapPath, 'utf8', (err, data) => {
        if (err) {
            console.error('[SEO] Error reading sitemap.xml:', err);
            return res.status(500).send('Error loading sitemap');
        }
        res.set('Content-Type', 'application/xml');
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        res.send(data);
    });
});

// Serve robots.txt
router.get('/robots.txt', (req, res) => {
    const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
    
    fs.readFile(robotsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('[SEO] Error reading robots.txt:', err);
            return res.status(500).send('Error loading robots.txt');
        }
        res.set('Content-Type', 'text/plain');
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        res.send(data);
    });
});

module.exports = router;
