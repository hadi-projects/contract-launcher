import { contracts, transactions, contractTemplates, type Contract, type InsertContract, type Transaction, type InsertTransaction, type ContractTemplate, type InsertContractTemplate } from "@shared/schema";

export interface IStorage {
  // Contract methods
  createContract(contract: InsertContract): Promise<Contract>;
  getContract(id: number): Promise<Contract | undefined>;
  getContractByAddress(address: string): Promise<Contract | undefined>;
  getContractsByNetwork(network: string): Promise<Contract[]>;
  getContractsByDeployer(deployerAddress: string): Promise<Contract[]>;
  updateContract(id: number, updates: Partial<Contract>): Promise<Contract | undefined>;

  // Transaction methods
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionByHash(hash: string): Promise<Transaction | undefined>;
  getTransactionsByAddress(address: string): Promise<Transaction[]>;
  getTransactionsByContract(contractAddress: string): Promise<Transaction[]>;
  updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined>;

  // Template methods
  getAllTemplates(): Promise<ContractTemplate[]>;
  getTemplate(id: number): Promise<ContractTemplate | undefined>;
  getTemplatesByCategory(category: string): Promise<ContractTemplate[]>;
}

export class MemStorage implements IStorage {
  private contracts: Map<number, Contract>;
  private transactions: Map<number, Transaction>;
  private templates: Map<number, ContractTemplate>;
  private contractIdCounter: number;
  private transactionIdCounter: number;
  private templateIdCounter: number;

  constructor() {
    this.contracts = new Map();
    this.transactions = new Map();
    this.templates = new Map();
    this.contractIdCounter = 1;
    this.transactionIdCounter = 1;
    this.templateIdCounter = 1;

    // Initialize with some contract templates
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const templates: Omit<ContractTemplate, 'id'>[] = [
      {
        name: "ERC-20 Token",
        description: "Standard fungible token implementation",
        category: "Token",
        sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10**decimals());
    }
}`,
        abi: [
          {
            "inputs": [
              {"name": "name", "type": "string"},
              {"name": "symbol", "type": "string"},
              {"name": "initialSupply", "type": "uint256"}
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          }
        ],
        constructorParams: [
          {"name": "name", "type": "string", "description": "Token name"},
          {"name": "symbol", "type": "string", "description": "Token symbol"},
          {"name": "initialSupply", "type": "uint256", "description": "Initial token supply"}
        ],
        tags: ["ERC20", "Token", "Standard"],
        isAudited: true,
        difficulty: "standard"
      },
      {
        name: "ERC-721 NFT",
        description: "Non-fungible token standard",
        category: "NFT",
        sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}
    
    function mint(address to) public onlyOwner {
        _mint(to, nextTokenId);
        nextTokenId++;
    }
}`,
        abi: [
          {
            "inputs": [
              {"name": "name", "type": "string"},
              {"name": "symbol", "type": "string"}
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          }
        ],
        constructorParams: [
          {"name": "name", "type": "string", "description": "NFT collection name"},
          {"name": "symbol", "type": "string", "description": "NFT collection symbol"}
        ],
        tags: ["ERC721", "NFT", "Standard"],
        isAudited: true,
        difficulty: "standard"
      }
    ];

    templates.forEach(template => {
      const id = this.templateIdCounter++;
      this.templates.set(id, { ...template, id });
    });
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    const id = this.contractIdCounter++;
    const contract: Contract = {
      ...insertContract,
      id,
      createdAt: new Date(),
    };
    this.contracts.set(id, contract);
    return contract;
  }

  async getContract(id: number): Promise<Contract | undefined> {
    return this.contracts.get(id);
  }

  async getContractByAddress(address: string): Promise<Contract | undefined> {
    return Array.from(this.contracts.values()).find(c => c.address.toLowerCase() === address.toLowerCase());
  }

  async getContractsByNetwork(network: string): Promise<Contract[]> {
    return Array.from(this.contracts.values()).filter(c => c.network === network);
  }

  async getContractsByDeployer(deployerAddress: string): Promise<Contract[]> {
    return Array.from(this.contracts.values()).filter(c => c.deployerAddress.toLowerCase() === deployerAddress.toLowerCase());
  }

  async updateContract(id: number, updates: Partial<Contract>): Promise<Contract | undefined> {
    const contract = this.contracts.get(id);
    if (!contract) return undefined;
    
    const updatedContract = { ...contract, ...updates };
    this.contracts.set(id, updatedContract);
    return updatedContract;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionByHash(hash: string): Promise<Transaction | undefined> {
    return Array.from(this.transactions.values()).find(t => t.hash.toLowerCase() === hash.toLowerCase());
  }

  async getTransactionsByAddress(address: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => 
      t.fromAddress.toLowerCase() === address.toLowerCase() || 
      t.toAddress?.toLowerCase() === address.toLowerCase()
    );
  }

  async getTransactionsByContract(contractAddress: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => 
      t.contractAddress?.toLowerCase() === contractAddress.toLowerCase()
    );
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...updates };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async getAllTemplates(): Promise<ContractTemplate[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: number): Promise<ContractTemplate | undefined> {
    return this.templates.get(id);
  }

  async getTemplatesByCategory(category: string): Promise<ContractTemplate[]> {
    return Array.from(this.templates.values()).filter(t => t.category === category);
  }
}

export const storage = new MemStorage();
