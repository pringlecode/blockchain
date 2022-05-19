var SHA256 = require('crypto-js/sha256');
var Transaction = /** @class */ (function () {
    function Transaction(sender, receiver, amount, message) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.message = message;
    }
    return Transaction;
}());
var Block = /** @class */ (function () {
    function Block(index, previousHash, data) {
        this.index = index;
        this.timestamp = Date.now();
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    Block.prototype.calculateHash = function () {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
        console.log(this.data);
    };
    return Block;
}());
var BlockChain = /** @class */ (function () {
    function BlockChain() {
        this.chain = [];
        this.pendingTransactions = [];
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
        var block = new Block(index, previousHash, {
            transactions: this.pendingTransactions
        });
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [new Transaction("blockchain", miningRewardAddress, this.miningReward, "mining reward")];
    };
    BlockChain.prototype.createTransaction = function (transaction) {
        this.pendingTransactions.push(transaction);
    };
    BlockChain.prototype.getBalanceOfAddress = function (address) {
        var balance = 0;
        for (var _i = 0, _a = this.chain; _i < _a.length; _i++) {
            var block = _a[_i];
            for (var _b = 0, _c = block.data.transactions; _b < _c.length; _b++) {
                var transaction = _c[_b];
                if (transaction.sender === address) {
                    balance -= transaction.amount;
                }
                if (transaction.receiver === address) {
                    balance += transaction.amount;
                }
            }
        }
        return balance;
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
// MyBlockChain.addBlock({ message: 'Second Block' });
// MyBlockChain.addBlock({ message: 'Third Block' });
// console.log(JSON.stringify(MyBlockChain, null, 1));
MyBlockChain.createTransaction(new Transaction('John Smith', 'Pizza Palace', 10000, 'one pineapple pizza, please!'));
MyBlockChain.createTransaction(new Transaction('Simon Williams', 'John Smith', 100, 'I ate 1% of your pizza so have 100 back'));
MyBlockChain.minePendingTransactions('Harry Potter');
MyBlockChain.createTransaction(new Transaction('John Smith', 'Phone repair shop', 50, 'Thanks for fixing my phone!'));
MyBlockChain.createTransaction(new Transaction('Simon Williams', 'John Smith', 300, 'I ate 3% of your pizza so have 300 back'));
MyBlockChain.minePendingTransactions('Donald Duck');
console.log("balance of John: ".concat(MyBlockChain.getBalanceOfAddress('John Smith')));
console.log("\nIs Blockchain valid?\t ".concat(MyBlockChain.isChainValid()));
// console.log(JSON.stringify(MyBlockChain, null, 1));
// Change the blockchain to ensure validation fails
// MyBlockChain.chain[1].data.message = "Hello World"
// console.log(JSON.stringify(MyBlockChain, null, 1));
// console.log('Is Blockchain valid? ' + MyBlockChain.isChainValid())
