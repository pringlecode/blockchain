import { join } from "path";

const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

class Transaction { 

    sender: string;
    receiver: string;
    amount: number;
    message: string;
    signature: string;

    constructor(sender: string, receiver: string, amount: number, message: string) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.message = message;
    }

    calculateHash() : string { 
        return SHA256(this.sender + this.receiver + this. amount + this.message).toString()
    }

    signTransaction(signingKey): void {
        if (signingKey.getPublic('hex') !== this.sender) {
            throw new Error('You cannot sign transactions for other wallets')
        } else {
            const hash: string = this.calculateHash();
            const signature = signingKey.sign(hash, 'base64');
            this.signature = signature.toDER('hex');
        }
    }

    isValid(): boolean {
        if (this.sender === null) return true;
        if (!this.signature || this.signature.length === 0) { 
            throw new Error('No signature in this transaction');
        }
        const publicKey = ec.keyFromPublic(this.sender, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }

}

class Block { 
    
    index: number;
    timestamp: number;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nonce: number;

    constructor(index: number, previousHash: string, transactions: Transaction[]) { 
        this.index = index;
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    
    calculateHash() : string { 
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
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
        console.log(this.transactions);
    }

    hasValidTransactions(): boolean {
        for (const tx of this.transactions) {
            if (!tx.isValid()) { 
                return false;
            }
        }
        return true;
    }
    
}

class BlockChain { 
    
    chain = []; 
    difficulty: number;
    pendingTransactions: Transaction[];
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
        let block: Block = new Block(index, previousHash, this.pendingTransactions);
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [new Transaction(`blockchain`, miningRewardAddress, this.miningReward, `mining reward`)]
    }

    addTransaction(transaction: Transaction): void {
        if (!transaction.sender || !transaction.receiver) { 
            throw new Error('Transaction must include sender and receeiver addresses');
        }
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to the chain');
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address: string) : number {
        let balance: number = 0;
        for (const block of this.chain) {
            if (block.index !== 0) {
                for (const transaction of block.transactions) {
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
    }

    isChainValid() : boolean { 
        for (let i = 1; i < this.chain.length; i++) { 
            const currentBlock : Block = this.chain[i];
            const previousBlock: Block = this.chain[i - 1];
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
    }

};

export {BlockChain, Transaction}