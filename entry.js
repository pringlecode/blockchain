"use strict";
exports.__esModule = true;
var blockchain_1 = require("./blockchain");
// Create the block chain
var MyBlockChain = new blockchain_1.BlockChain();
// Simulate block creation
// MyBlockChain.addBlock({ message: 'Second Block' });
// MyBlockChain.addBlock({ message: 'Third Block' });
// console.log(JSON.stringify(MyBlockChain, null, 1));
MyBlockChain.createTransaction(new blockchain_1.Transaction('John Smith', 'Pizza Palace', 10000, 'one pineapple pizza, please!'));
MyBlockChain.createTransaction(new blockchain_1.Transaction('Simon Williams', 'John Smith', 100, 'I ate 1% of your pizza so have 100 back'));
MyBlockChain.minePendingTransactions('Harry Potter');
MyBlockChain.createTransaction(new blockchain_1.Transaction('John Smith', 'Phone repair shop', 50, 'Thanks for fixing my phone!'));
MyBlockChain.createTransaction(new blockchain_1.Transaction('Simon Williams', 'John Smith', 300, 'I ate 3% of your pizza so have 300 back'));
MyBlockChain.minePendingTransactions('Donald Duck');
console.log("balance of John: ".concat(MyBlockChain.getBalanceOfAddress('John Smith')));
console.log("\nIs Blockchain valid?\t ".concat(MyBlockChain.isChainValid()));
// console.log(JSON.stringify(MyBlockChain, null, 1));
// Change the blockchain to ensure validation fails
// MyBlockChain.chain[1].data.message = "Hello World"
// console.log(JSON.stringify(MyBlockChain, null, 1));
// console.log('Is Blockchain valid? ' + MyBlockChain.isChainValid())
