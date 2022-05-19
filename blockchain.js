"use strict";
exports.__esModule = true;
exports.Transaction = exports.BlockChain = void 0;
var SHA256 = require('crypto-js/sha256');
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var Transaction = /** @class */ (function () {
    function Transaction(sender, receiver, amount, message) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.message = message;
    }
    Transaction.prototype.calculateHash = function () {
        return SHA256(this.sender + this.receiver + this.amount + this.message).toString();
    };
    Transaction.prototype.signTransaction = function (signingKey) {
        if (signingKey.getPublic('hex') !== this.sender) {
            throw new Error('You cannot sign transactions for other wallets');
        }
        else {
            var hash = this.calculateHash();
            var signature = signingKey.sign(hash, 'base64');
            this.signature = signature.toDER('hex');
        }
    };
    Transaction.prototype.isValid = function () {
        if (this.sender === null)
            return true;
        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }
        var publicKey = ec.keyFromPublic(this.sender, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    };
    return Transaction;
}());
exports.Transaction = Transaction;
var Block = /** @class */ (function () {
    function Block(index, previousHash, transactions) {
        this.index = index;
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    Block.prototype.calculateHash = function () {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    };
    Block.prototype.mineBlock = function (difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        this.display();
    };
    Block.prototype.display = function () {
        console.log("\nBlock Mined!\n\tSolution:\t".concat(this.nonce, "\n\tBlock Number:\t").concat(this.index));
        console.log(this.transactions);
    };
    Block.prototype.hasValidTransactions = function () {
        for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
            var tx = _a[_i];
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    };
    return Block;
}());
var BlockChain = /** @class */ (function () {
    function BlockChain() {
        this.chain = [];
        this.chain = [];
        this.difficulty = 4;
        this.createGenesisBlock();
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    BlockChain.prototype.createGenesisBlock = function () {
        this.minePendingTransactions(null);
    };
    BlockChain.prototype.getLatestBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    BlockChain.prototype.getLatestBlockHash = function () {
        return this.chain.length !== 0 ? this.getLatestBlock().hash : 'genesis';
    };
    BlockChain.prototype.minePendingTransactions = function (miningRewardAddress) {
        /**
         * TODO Allow miners to choose the best transactions
         */
        var index = this.chain.length;
        var previousHash = this.getLatestBlockHash();
        var block = new Block(index, previousHash, this.pendingTransactions);
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [new Transaction("blockchain", miningRewardAddress, this.miningReward, "mining reward")];
    };
    BlockChain.prototype.addTransaction = function (transaction) {
        if (!transaction.sender || !transaction.receiver) {
            throw new Error('Transaction must include sender and receeiver addresses');
        }
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to the chain');
        }
        this.pendingTransactions.push(transaction);
    };
    BlockChain.prototype.getBalanceOfAddress = function (address) {
        var balance = 0;
        for (var _i = 0, _a = this.chain; _i < _a.length; _i++) {
            var block = _a[_i];
            if (block.index !== 0) {
                for (var _b = 0, _c = block.transactions; _b < _c.length; _b++) {
                    var transaction = _c[_b];
                    if (transaction.sender === address) {
                        balance -= transaction.amount;
                    }
                    if (transaction.receiver === address) {
                        balance += transaction.amount;
                    }
                }
            }
        }
        return balance;
    };
    BlockChain.prototype.isChainValid = function () {
        for (var i = 1; i < this.chain.length; i++) {
            var currentBlock = this.chain[i];
            var previousBlock = this.chain[i - 1];
            if (!currentBlock.hasValidTransactions()) {
                return false;
            }
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    };
    return BlockChain;
}());
exports.BlockChain = BlockChain;
;
