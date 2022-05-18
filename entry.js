var SHA256 = require('crypto-js/sha256');
var Block = /** @class */ (function () {
    function Block(index, previousHash, data) {
        this.index = index;
        this.timestamp = Date.now();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    Block.prototype.calculateHash = function () {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    };
    return Block;
}());
var BlockChain = /** @class */ (function () {
    function BlockChain() {
        this.chain = [];
        this.createGenesisBlock();
    }
    BlockChain.prototype.createGenesisBlock = function () {
        this.addBlock({ message: "Genesis Block" });
    };
    BlockChain.prototype.getLatestBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    BlockChain.prototype.getLatestBlockHash = function () {
        return this.chain.length !== 0 ? this.getLatestBlock().hash : '';
    };
    BlockChain.prototype.addBlock = function (data) {
        var index = this.chain.length;
        var previousHash = this.getLatestBlockHash();
        var block = new Block(index, previousHash, data);
        this.chain.push(block);
    };
    BlockChain.prototype.isChainValid = function () {
        for (var i = 1; i < this.chain.length; i++) {
            var currentBlock = this.chain[i];
            var previousBlock = this.chain[i - 1];
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
;
// Create the block chain
var MyBlockChain = new BlockChain();
// Simulate block creation
MyBlockChain.addBlock({ message: 'Second Block' });
MyBlockChain.addBlock({ message: 'Third Block' });
console.log(JSON.stringify(MyBlockChain, null, 1));
console.log('Is Blockchain valid? ' + MyBlockChain.isChainValid());
// Change the blockchain to ensure validation fails
// MyBlockChain.chain[1].data.message = "Hello World"
// console.log(JSON.stringify(MyBlockChain, null, 1));
// console.log('Is Blockchain valid? ' + MyBlockChain.isChainValid())
