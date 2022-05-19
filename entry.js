"use strict";
exports.__esModule = true;
var blockchain_1 = require("./blockchain");
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var myKey = ec.keyFromPrivate('92534657795a3c2f97377eefee07116c013ec4522be562b9d4bf5a2764f56dd9');
var myWalletAddress = myKey.getPublic('hex');
// Create the block chain
var MyBlockChain = new blockchain_1.BlockChain();
// Create and sign a transaction
var tx1 = new blockchain_1.Transaction(myWalletAddress, 'receipient address goes here', 100, 'have a nice day');
tx1.signTransaction(myKey);
// add the signed transaction
MyBlockChain.addTransaction(tx1);
// Mine pending transactions
MyBlockChain.minePendingTransactions(myWalletAddress);
// Display balance of wallet
console.log("balance of John: ".concat(MyBlockChain.getBalanceOfAddress(myWalletAddress)));
// Check blockchain is valid
console.log("\nIs Blockchain valid?\t ".concat(MyBlockChain.isChainValid()));
// diplay the entire blockchain
// console.log(JSON.stringify(MyBlockChain, null, 1));
