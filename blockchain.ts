const SHA256 = require('crypto-js/sha256');

class Transaction { 

    sender: string;
    receiver: string;
    amount: number;
    message: string;

    constructor(sender: string, receiver: string, amount: number, message: string) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.message = message;
    }

}

class Block { 
    
    index: number;
    timestamp: number;
    data: object;
    previousHash: string;
    hash: string;
    nonce: number;

    constructor(index: number, previousHash: string, data: object) { 
        this.index = index;
        this.timestamp = Date.now();
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    
    calculateHash() : string { 
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty: number) : void { 
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) { 
            this.nonce++;
            this.hash = this.calculateHash()
        }
        this.display();
    }

    display() : void {
        console.log(`\nBlock Mined!\n\tSolution:\t${this.nonce}\n\tBlock Number:\t${this.index}`)
        console.log(this.data);
    }
    
}

class BlockChain { 
    
    chain = []; 
    difficulty: number;
    pendingTransactions = [];
    miningReward: number;

    constructor() {
        this.chain = [];
        this.difficulty = 4;
        this.createGenesisBlock();
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(): void { 
        this.minePendingTransactions(null);
    }

    getLatestBlock() : Block { 
        return this.chain[this.chain.length - 1];
    }

    getLatestBlockHash() : string { 
        return this.chain.length !== 0 ? this.getLatestBlock().hash : 'genesis';
    }

    minePendingTransactions(miningRewardAddress: string): void {
       /**
        * TODO Allow miners to choose the best transactions
        */
        let index : number = this.chain.length;
        let previousHash: string = this.getLatestBlockHash();
        let block: Block = new Block(index, previousHash, {
            transactions: this.pendingTransactions
        });
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [new Transaction(`blockchain`, miningRewardAddress, this.miningReward, `mining reward`)]
    }

    createTransaction(transaction: Transaction): void { 
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address: string) : number { 
        let balance: number = 0;
        for (const block of this.chain) {
            for (const transaction of block.data.transactions) {
                if (transaction.sender === address) { 
                    balance -= transaction.amount;
                }
                if (transaction.receiver === address) {
                    balance += transaction.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() : boolean { 
        for (let i = 1; i < this.chain.length; i++) { 
            const currentBlock : Block = this.chain[i];
            const previousBlock : Block = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) { 
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) { 
                return false;
            }
        }
        return true;
    }

};

export {BlockChain, Transaction}