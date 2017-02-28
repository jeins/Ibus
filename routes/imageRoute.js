'use strict';

const express = require('express');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();

const imagePath = __dirname + '/../public/images/';

/**
 * get image from name and file extension
 */
router.get('/:name/:extension', (req, res)=>{
    let imgExtension = req.params.extension;
    let imgName = req.params.name + '.' + imgExtension;

    fs.readFile(imagePath + imgName, (err, data)=>{
        if(err) throw err;

        res.writeHead(200, {'Content-Type': imgExtension});
        res.end(data, 'binary');
    })
});

/**
 * upload image
 */
router.post('/', (req, res)=>{
    let storage = multer.diskStorage({
        destination: (req, file, cb)=>{cb(null, imagePath);},
        filename: (req, file, cb)=>{cb(null, file.originalname);}
    });
    let upload = multer({storage: storage}).single('file');

    upload(req, res, (err)=>{
        if(err) {
            res.json({error_code:1,err_desc:err});
        }
        else {
            res.json({success: true});
        }
    });
});

module.exports = router;