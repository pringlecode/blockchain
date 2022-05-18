const SHA256 = require('crypto-js/sha256');

class Block { 
    
    index: number;
    timestamp: number;
    data: object;
    previousHash: string;
    hash: string;

    constructor(index: number, previousHash: string, data: object) { 
        this.index = index;
        this.timestamp = Date.now();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    
    calculateHash() { 
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString()
    }

}

class BlockChain { 
    
    chain = [] 

    constructor() {
        this.createGenesisBlock();
    }

    createGenesisBlock() { 
        this.addBlock({ message: "Genesis Block" });
    }

    getLatestBlock() { 
        return this.chain[this.chain.length - 1];
    }

    getLatestBlockHash() { 
        return this.chain.length !== 0 ? this.getLatestBlock().hash : '';
    }

    addBlock(data: object) {
        let index : number = this.chain.length;
        let previousHash : string = this.getLatestBlockHash()
        let block : Block = new Block(index, previousHash, data);
        this.chain.push(block);
    }

    isChainValid() { 
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

// Create the block chain
const MyBlockChain = new BlockChain();

// Simulate block creation
MyBlockChain.addBlock({ message: 'Second Block' });
MyBlockChain.addBlock({ message: 'Third Block' });
console.log(JSON.stringify(MyBlockChain, null, 1));


console.log('Is Blockchain valid? ' + MyBlockChain.isChainValid())

// Change the blockchain to ensure validation fails
// MyBlockChain.chain[1].data.message = "Hello World"
// console.log(JSON.stringify(MyBlockChain, null, 1));

// console.log('Is Blockchain valid? ' + MyBlockChain.isChainValid())
