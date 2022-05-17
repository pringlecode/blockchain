// Licence MIT
const bcrypt = require('bcrypt');

class Block { 
    
    constructor(index, prevHash, data) { 
        this.index = index;
        this.time = Date.now();
        this.data = data;
        this.prevHash = prevHash;
        this.blockHash = this.calcHash();
    }
    
    calcHash() { 
        let salty = 10
        return bcrypt.hashSync(
            String(this.index + this.prevHash + this.time + JSON.stringify(this.data)),
            salty
        );
    }

};

class BlockChain { 
    
    constructor() { 
        this.chain = [];
        this.createGenesisBlock();
    }

    createGenesisBlock() { 
        this.addBlock(new Block({message:"Genesis Block"}))
    }

    addBlock(data) {
        let index = this.chain.length;
        let prevHash = this.chain.length !== 0 ? this.chain[index - 1].blockHash : '';
        let block = new Block(index, prevHash, data);
        this.chain.push(block);
    }

    isChainValid() { 
        for (let i = 1; i < this.chain.length; i++) { 
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.blockHash !== currentBlock.calcHash()) { 
                return false;
            }
            if (currentBlock.prevHash !== previousBlock.blockHash) { 
                return false;
            }
        }
        return true;
    }

};

const MyBlockChain = new BlockChain();

MyBlockChain.addBlock({ message: 'Second Block' });
MyBlockChain.addBlock({ message: 'Third Block' });

console.log(JSON.stringify(MyBlockChain, null, 1));

console.log('Is Blockchain valid? ' + MyBlockChain.isChainValid())
