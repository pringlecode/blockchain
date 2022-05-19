import { BlockChain, Transaction } from './blockchain';

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('92534657795a3c2f97377eefee07116c013ec4522be562b9d4bf5a2764f56dd9');
const myWalletAddress = myKey.getPublic('hex')

// Create the block chain
let MyBlockChain: BlockChain = new BlockChain();

// Create and sign a transaction
const tx1 = new Transaction(myWalletAddress, 'receipient address goes here', 100, 'have a nice day');
tx1.signTransaction(myKey);


// add the signed transaction
MyBlockChain.addTransaction(tx1)


// Mine pending transactions
MyBlockChain.minePendingTransactions(myWalletAddress);

// Display balance of wallet
console.log(`balance of John: ${MyBlockChain.getBalanceOfAddress(myWalletAddress)}`);

// Check blockchain is valid
console.log(`\nIs Blockchain valid?\t ${MyBlockChain.isChainValid()}`);

// diplay the entire blockchain

// console.log(JSON.stringify(MyBlockChain, null, 1));
