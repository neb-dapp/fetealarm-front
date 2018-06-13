"use strict";

var Card = function() {
    this.id = -1;
    this.fromAddress = "";
    this.fromEmail = "";
    this.toEmail = "";
    this.toName = "";
    this.content = "";
    this.createTime = ""; // yyyy-mm-dd hh:mm:ss
    this.sendTime = "";  // yyyy-mm-dd hh:mm
};

var HappyBirthday = function () {
    LocalContractStorage.defineMapProperty(this, "cardMap");
    LocalContractStorage.defineProperty(this, "mapSize");
};

HappyBirthday.prototype = {
    init: function () {
        this.mapSize = 0;
    },

    getOne: function(id) {
        return this.cardMap.get(id);
    },

    checkAddress: function(id) {
        var card = this.getOne(id);
        if(!card) {
            throw new Error("no such card");
        }
        var from = Blockchain.transaction.from;
        if(from != card.fromAddress) {
            throw new Error("address is wrong");
        }
    },

    pad2: function(n) { return n < 10 ? '0' + n : n },

    save: function(fromEmail, toEmail, toName, content, sendTime) {
        var card = new Card();
        var from = Blockchain.transaction.from;
        card.id = this.mapSize;
        card.fromAddress = from;
        card.fromEmail = fromEmail;
        card.toEmail = toEmail;
        card.toName = toName;
        card.content = content;
        card.sendTime = sendTime;
        var date = new Date();
        var createTime = date.getFullYear().toString() + '-' + this.pad2(date.getMonth() + 1) + '-' + this.pad2(date.getDate()) + ' ' + this.pad2(date.getHours()) + ':' + this.pad2(date.getMinutes()) + ':' + this.pad2(date.getSeconds());
        card.createTime = createTime;
        this.cardMap.set(this.mapSize, card);
        this.mapSize += 1;
    },

    getAll: function () {
        var result = [];
        for(var i=0; i<this.mapSize; i++) {
            result.push(this.cardMap.get(i));
        }
        return result;
    },
};

module.exports = HappyBirthday;