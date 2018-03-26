var Web3 = require('web3');
const Tx = require('ethereumjs-tx')
web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/bROt9lCMNUUiM0Lqd8jg"));
// console.log(web3);

var abi = read_abi();
var contractAddress = "0x108C3032533Fd9C8507700433C760693Dd0CaE74";
var MyTestContract = new web3.eth.Contract(abi, contractAddress);
// console.log(MyTestContract)

account ={
	publicKey: '0xac7198859416d238ee5547a4486712bf6c26bf8b',
	privateKey: 'ED126374E49881BD7FB7BE98A25DA53475C81C56639F0429435EE88F1E58FDAB'
}

account2 ={
	publicKey : "0xe83589c48fb4e2b972921321c25e257ecc32a0b7",
	privateKey : "BF08A3C716E2397FBD127ABDA13902A1BC443D4FC2365D3A553163119A8A8098"
}


var myaccount = '0x9f4fA12a501919273b80cFd4b6bAA484c54F7105';

web3.eth.getBlockNumber().then(last =>{
	getTransactionsByAccount(myaccount, null, 2915490);
});

var transactions = [];
function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber){
  if (endBlockNumber == null) {
    endBlockNumber = web3.eth.blockNumber;
    console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (startBlockNumber == null) {
    startBlockNumber = endBlockNumber - 3;
    console.log("Using startBlockNumber: " + startBlockNumber);
  }
  console.log("BLOCK: ", startBlockNumber);
	var block = web3.eth.getBlock(startBlockNumber, true).then(block=>{
		if (block != null && block.transactions != null) {
			block.transactions.forEach( function(e) {
				var from = (e.from? e.from.toLowerCase() : null);
				var to = (e.to? e.to.toLowerCase() : null);
				if (myaccount.toLowerCase() == from || myaccount.toLowerCase() == to) {
					console.log("  tx hash          : " + e.hash + "\n"
					+ "   nonce           : " + e.nonce + "\n"
					+ "   blockHash       : " + e.blockHash + "\n"
					+ "   blockNumber     : " + e.blockNumber + "\n"
					+ "   transactionIndex: " + e.transactionIndex + "\n"
					+ "   from            : " + e.from + "\n" 
					+ "   to              : " + e.to + "\n"
					+ "   value           : " + e.value + "\n"
					+ "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
					+ "   gasPrice        : " + e.gasPrice + "\n"
					+ "   gas             : " + e.gas + "\n"
					+ "   input           : " + e.input);
					transactions.push({
						block: e.blockNumber,
						transaction: e.hash
					})
					console.log("-----------------------------------");
				}
			})
		}
		console.log("========================================================");
		if(startBlockNumber < endBlockNumber)
			getTransactionsByAccount(myaccount, startBlockNumber+1, endBlockNumber);
		else
			console.log(transactions);
	});

}


function getBalance(publicKey, cb){
	MyTestContract.methods.get_balance().call({from:publicKey}).then(balance => {	
		return cb(balance);
	});
}
function register(privateKey,publicKey,cb){
	payloadData = MyTestContract.methods.register().encodeABI();
	web3.eth.getTransactionCount(publicKey).then(txCount => {
		const txData = {
			nonce: web3.utils.toHex(txCount),
			gasLimit: web3.utils.toHex(250000 ),
			gasPrice: web3.utils.toHex(10e3), // 10 Gwei
			to: contractAddress,
			from: publicKey,
			value: '0x00',
			data: payloadData
		}

		// fire away!
		sendSigned(txData, privateKey,function(err, result) {
			if (err) {
				console.log('***Error ', err)
				return cb(0);
			}
			else {
				console.log('***Sent', result)
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
function read_abi(){
	console.log("Reading ABI...");
	var fs = require("fs");
	var content = fs.readFileSync("./abi.json");
	var abi = JSON.parse(content.toString());
	console.log("ABI read successfully!")
	return abi;
}






/*-----------------------------------------------------------------------------------*/


// if (typeof Web3 !== 'undefined') {
  // web3 = new Web3(Web3.currentProvider);
	// console.log("here1")
	// console.log(web3);
// } else {
	// web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	// console.log("here2");
// }



// console.log("Connected: ", web3.isConnected());
// console.log("Network: ", web3.version.network);
// console.log(web3.eth)


// web3.personal.newAccount("Mike", function(x,y,z){
	// console.log("x: ",x);
	// console.log("y: ",y);
	// console.log("z: ",z);
// });

// console.log(web3.personal.unlockAccount);
// web3.personal.unlockAccount("0xd6e6b647c70d5b0f77680d2917609c41b7b159edba3a320b2d8fc041a5c99b43", "password", 1000);

// web3.eth.personal.unlockAccount("0xAB273087fE5De41B8B8E195968762caC1717e101", 'password', 600)
	// .then((response) => {
		// console.log(response);
	// }).catch((error) => {
		// console.log(error);
	// });


/*web3.eth.getAccounts(function(error, result){
	accounts = result;
	console.log("Accounts:", accounts);
	
	web3.eth.defaultAccount = accounts[0];
	console.log(accounts[0]);
	console.log(web3.eth.getBalance(accounts[0]).valueOf());
	
	
	var fs = require("fs");
	var content = fs.readFileSync("./build/contracts/MetaCoin.json");
	var abi = JSON.parse(content.toString()).abi;
	
	var MyContract = web3.eth.contract(abi);
	var myContractInstance = MyContract.at('0x9a6d86b279c8084782d541341950482d61c14abd');
	
	console.log("before");
	var temp = myContractInstance.getBalance.call(accounts[0]);
	console.log("Account1:", temp.valueOf());
	
	var temp2 = myContractInstance.getBalance.call(accounts[1]);
	console.log("Accout2:", temp2.valueOf());
	

	
	var x = web3.eth.getBalance(accounts[0]);
	console.log(x.valueOf());
	
	var temp3 = myContractInstance.sendCoin.call(accounts[1], 600, {from: accounts[0], gas: 200000});
	console.log(temp3);
	
	
	console.log("after");
	var temp = myContractInstance.getBalance.call(accounts[0]);
	console.log("Account1:", temp.valueOf());
	
	var temp2 = myContractInstance.getBalance.call(accounts[1]);
	console.log("Accout2:", temp2.valueOf());	
});*/