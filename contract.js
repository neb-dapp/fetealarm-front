
// TX Hash	adfd2e174946625ae0b2cbd762c6ec79442c4ae3638ada7494bc73de276f552e
// Contract address	n1hEZvcNh4gGqwj4aWm1wSuraqabT6RkfCM

"use strict";

var Card = function() {
    this.id = -1;
    this.fromAddress = "";
    this.fromEmail = "";
    this.fromName = "";
    this.toEmail = "";
    this.toName = "";
    this.content = "";
    this.birthday = ""; // yyyy-mm-dd
    this.createTime = ""; // yyyy-mm-dd hh:mm:ss
    this.sendTime = "";  // yyyy-mm-dd hh:mm
    this.kind = 0; //贺卡样式
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

    save: function(fromEmail, fromName, toEmail, toName, content, birthday, sendTime, kind) {
        var card = new Card();
        var from = Blockchain.transaction.from;
        card.id = this.mapSize;
        card.fromAddress = from;
        card.fromEmail = fromEmail;
        card.fromName = fromName;
        card.toEmail = toEmail;
        card.toName = toName;
        card.content = content;
        card.birthday = birthday;
        card.sendTime = sendTime;
        card.kind = kind;
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

    // 倒叙分页遍历
    getPage: function(limit, offset) {
        var result = [];
        limit = limit;
        offset = offset;
        if(offset >= this.mapSize){
            throw new Error("the last page");
        }
        if(offset < 0) {
            throw new Error("the first page");
        }
        var number = offset+limit;
        if(number > this.mapSize){
            number = this.mapSize;
        }
        for(var i=offset;i<number;i++){
            result.push(this.cardMap.get(this.mapSize - 1 - i));
        }
        return result;
    }
};

module.exports = HappyBirthday;