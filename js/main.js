function save() {
    var to = dappAddress;
    var value = "0";
    var callFunction = "save";
    var fromEmail = $("#fromEmail").val();
    var fromName = $("#fromName").val();
    var toEmail = $("#toEmail").val();
    var toName = $("#toName").val();
    var content = $("#content").val();
    var birthday = $("#birthday").val();
    var sendTime = $("#sendTime").val();
    var callArgs = JSON.stringify([fromEmail, fromName, toEmail, toName, content, birthday, sendTime]);
    
    serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
        listener: cbPush        //设置listener, 处理交易返回信息
    });

    intervalQuery = setInterval(function () {
        funcIntervalQuery();
    }, 5000);
}
function funcIntervalQuery() {
    nebPay.queryPayInfo(serialNumber)   //search transaction result from server (result upload to server by app)
        .then(function (resp) {
            console.log("tx result: " + resp)   //resp is a JSON string
            var respObject = JSON.parse(resp)
            if(respObject.code === 0){
                clearInterval(intervalQuery)
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function cbPush(resp) {
    console.log("response of push: " + JSON.stringify(resp))
}

function getAll() {
    var from = Account.NewAccount().getAddressString();
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "getAll";
    var callArgs = JSON.stringify([]); //in the form of ["args"]
    var contract = {
        "function": callFunction,
        "args": callArgs
    }

    neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
        cbSearch(resp)
    }).catch(function (err) {
        //cbSearch(err)
        console.log("error:" + err.message);
    });
}
function cbSearch(resp) {
    var result = resp.result    ////resp is an object, resp.result is a JSON string
    console.log("return of rpc call: " + JSON.stringify(result));
}