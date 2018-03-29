var express = require('express');
var app = express();

var Web3 = require('web3');
var CryptoJS = require("crypto-js");
const Tx = require('ethereumjs-tx')
web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/bROt9lCMNUUiM0Lqd8jg"));
var account = generate_keys();
ownerPubKey = '';

var abi = read_abi();
var contractAddress = "0x7625914bfcc3c9fa7709b0fb52cc44a6803ef575";
var passChainContract = new web3.eth.Contract(abi, contractAddress);
var Logs = [];
getLogs(account.publicKey);

var test = "0x6660000000000000000000000000000000000000000000000000000000000000";
sendLog(account.privateKey,account.publicKey,test,function(){
	
});



function generate_keys(){
	return {
		publicKey : "0x0592adff73847e190a63a9d7d28dac7584c1ada0",
		privateKey : "fd4b41a2e81281340cde9d5d7d1140fbce0e527bf7eaf9c7dc41e44a7da1426a"
	}
}
function read_abi(){
	console.log("Reading ABI...");
	var fs = require("fs");
	var content = fs.readFileSync("./new_abi.json");
	var abi = JSON.parse(content.toString());
	console.log("ABI read successfully!")
	return abi;
}
function getLogs(publicKey){
	passChainContract.methods.getLogs().call({from:publicKey}).then(logs => {	
		Logs = logs;
		console.log("Logs: ", Logs);
		setTimeout(getLogs, 5000, publicKey);
	});
}
function sendLog(privateKey,publicKey,log,cb){
	payloadData = passChainContract.methods.addLogs(log).encodeABI();
	web3.eth.getTransactionCount(publicKey).then(txCount => {
		const txData = {
			nonce: web3.utils.toHex(txCount),
			gasLimit: web3.utils.toHex(250000 ),
			gasPrice: web3.utils.toHex(10e4), // 10 Gwei
			to: contractAddress,
			from: publicKey,
			value: '0x00',
			data: payloadData
		}

		sendSigned(txData, privateKey,function(err, result) {
			if (err) {
				console.log('***Error ', err)
				return cb(0);
			}
			else {
				console.log('Log Added Successfully. Transaction Id: ', result)
				return cb(1)
			}
		})
	})
}
function sendSigned(txData, privateKey,cb) {
  privateKey = new Buffer(privateKey, 'hex')
  const transaction = new Tx(txData)
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')
  web3.eth.sendSignedTransaction('0x' + serializedTx, cb)
} 
function validate(pass){
	var passJson = JSON.parse(pass);
	console.log(passJson);
	var signature = passJson.signature || '';
	delete passJson.signature;
	
	// var msg = web3.utils.sha3(JSON.stringify(passJson));
	var msg = JSON.stringify(passJson);
	var pub = web3.eth.accounts.recover(msg, signature);
	if(ownerPubKey == pub)
	{
		console.log("##############################################");
		console.log("#                                            #");
		console.log("#                                            #");
		console.log("#                VERIFIED !!!                #");
		console.log("#                                            #");
		console.log("#                                            #");
		console.log("##############################################");
		
		// var log = (JSON.stringify{
			// id : 1,
			// name : "mike"
		// });
		// log_buff = new Buffer(log, "binary");
		
		var log_buff = "0x9990000000000000000000000000000000000000000000000000000000000000";
		sendLog(account.privateKey,account.publicKey,log_buff,function(){});
		return true;
	}
	else{
		console.log("Unverified");
		return false;
	}
}


var server = app.listen(9999, function () {
	var port = server.address().port;
	console.log("NASS Server listening on Port:%s", port);
});





