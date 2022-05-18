const SHA256 = require('crypto-js/sha256');

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
    
    calculateHash() { 
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty: number) { 
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) { 
            this.nonce++;
            this.hash = this.calculateHash()
        }
        console.log(`\nBlock Mined!\n\tSolution:\t${this.nonce}\n\tBlock Number:\t${this.index}\n\tMessage:\t${this.data['message']}`)
    }

}

class BlockChain { 
    
    chain = []; 
    difficulty: number;

    constructor() {
        this.chain = [];
        this.difficulty = 5;
        this.createGenesisBlock();
    }

    createGenesisBlock() : void { 
        this.addBlock({ message: "Genesis Block" });
    }

    getLatestBlock() : Block { 
        return this.chain[this.chain.length - 1];
    }

    getLatestBlockHash() : string { 
        return this.chain.length !== 0 ? this.getLatestBlock().hash : '';
    }

    addBlock(data: object) : void {
        let index : number = this.chain.length;
        let previousHash: string = this.getLatestBlockHash();
        let block: Block = new Block(index, previousHash, data);
        block.mineBlock(this.difficulty);
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
//console.log(JSON.stringify(MyBlockChain, null, 1));


console.log(`\nIs Blockchain valid?\t ${MyBlockChain.isChainValid()}`);

// Change the blockchain to ensure validation fails
// MyBlockChain.chain[1].data.message = "Hello World"
// console.log(JSON.stringify(MyBlockChain, null, 1));

// console.log('Is Blockchain valid? ' + MyBlockChain.isChainValid())
