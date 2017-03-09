'use strict';

const Sequelize = require("sequelize");
const _ = require('lodash');
const env       = process.env.NODE_ENV || "development";
const config    = require('../configs/config')[env];

let sequelize;
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

function Model(){};

Model.Sequelize = Sequelize;

Model.sequelize = sequelize;

Model.validateData = (allowedFields, data)=>{
	let obj = {};

    _.forEach(allowedFields, (field) => {
        if (_.isObject(data[field])) {
            data[field] = JSON.stringify(data[field]);
        }

        if(_.hasIn(data, field)) {
            obj[field] = data[field];
        }
    });

    return obj;
};

Model.decodeJson = (objs)=>{
	objs = JSON.parse(JSON.stringify(objs));

    let doDecode = (obj)=>{
        _.forEach(obj, (value, key) => {
            try {
                obj[key] = JSON.parse(value);
            } catch (e) {
            }
        });
    };

    let doConvertImage = (obj)=>{
        let attributes = ['image', 'billImage'];

        _.forEach(attributes, (attribute)=>{
            if(_.hasIn(obj, attribute)) obj[attribute] = _convertImage(obj[attribute]);
        });
    };

    let doConvertPrice = (obj)=>{
        let attributes = ['sellingPrice', 'purchasePrice', 'shippingPrice', 'totalPrice'];

        _.forEach(attributes, (attribute)=>{
            if(_.hasIn(obj, attribute)) _convertPrice(obj[attribute]);
        });
    };

    if(_.isArray(objs)){
        _.forEach(objs, (obj) => {
            doDecode(obj);
            doConvertImage(obj);
            doConvertPrice(obj);
        });
    } else{
        doDecode(objs);
        doConvertImage(objs);
        doConvertPrice(objs);
    }

    return objs;
};

Model.errorHandler = (err)=>{
    return {
        error: true,
        message: err.message
    };
};

function _convertImage(img){
    if(!img) return img;
    if(!img.includes('jpg')) return img;

    let tmpArr = img.split('.');
    let imgName;

    if(tmpArr.length > 2){
        _.forEach(tmpArr, (tmp)=>{
            imgName += tmp;
        })
    } else{
        imgName = tmpArr[0];
    }

    return '/image/' + imgName + '/' + tmpArr[tmpArr.length - 1];
}

function _convertPrice(obj){
    let priceText = [];

    if(obj.currency === 'rupiah'){
        let n = 3;
        let val = obj.value.toString();
        let i;

        for(i=n; i < val.length; i+=n){
            priceText.push(val.substr(val.length - i, n));
        }

        priceText = _.reverse(priceText);

        let txt = '.' + _.join(priceText, '.');
        let rest = val.replace(_.join(priceText, ''), '');

        obj['text'] = 'Rp ' + ((rest === '.') ? txt : (txt === '.') ? rest : rest + txt);
    } else{
        //TODO
        obj['text'] = obj.value + ' €';
    }
}

module.exports = Model;