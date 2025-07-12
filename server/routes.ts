import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContractSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";
import validateSolidityCode from "./validation/contract";
// import Solc from "./service/solc";
import solc from 'solc'
import Solc from "./service/solc";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contract routes
  app.get("/api/contracts", async (req, res) => {
    try {
      const { network, deployer } = req.query;

      let contracts: any[] = [];
      if (network) {
        contracts = await storage.getContractsByNetwork(network as string);
      } else if (deployer) {
        contracts = await storage.getContractsByDeployer(deployer as string);
      }

      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.get("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contract = await storage.getContract(id);

      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  app.get("/api/contracts/address/:address", async (req, res) => {
    try {
      const address = req.params.address;
      const contract = await storage.getContractByAddress(address);

      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  app.post("/api/contracts", async (req, res) => {
    try {
      const contractData = insertContractSchema.parse(req.body);
      const contract = await storage.createContract(contractData);
      res.status(201).json(contract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contract data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contract" });
    }
  });

  app.patch("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const contract = await storage.updateContract(id, updates);

      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to update contract" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const { address, contract } = req.query;

      let transactions: any[] = [];
      if (address) {
        transactions = await storage.getTransactionsByAddress(address as string);
      } else if (contract) {
        transactions = await storage.getTransactionsByContract(contract as string);
      }

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransaction(id);

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  app.get("/api/transactions/hash/:hash", async (req, res) => {
    try {
      const hash = req.params.hash;
      const transaction = await storage.getTransactionByHash(hash);

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.patch("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const transaction = await storage.updateTransaction(id, updates);

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });

  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const { category } = req.query;

      let templates;
      if (category) {
        templates = await storage.getTemplatesByCategory(category as string);
      } else {
        templates = await storage.getAllTemplates();
      }

      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplate(id);

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Solidity compilation endpoint
  app.post("/api/compile", async (req, res) => {
    try {
    const { sourceCode, solidityVersion, contractName, isBase64 = true } = req.body;
    const hasPragma = sourceCode.match(/pragma\s+solidity/i);
    const hasContract = sourceCode.match(/contract\s+\w+/i);

    // Validasi input
    if (!sourceCode || !solidityVersion || !contractName) {
      return res.status(400).json({
        error: 'Missing required fields: sourceCode, solidityVersion, or contractName'
      });
    }

    // Decode Base64 jika diperlukan
    let decodedSourceCode: string;
    try {
      decodedSourceCode = isBase64
        ? Buffer.from(sourceCode, 'base64').toString('utf8')
        : sourceCode;
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid Base64 encoding',
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Validasi kode Solidity
    const validation = validateSolidityCode(decodedSourceCode);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Invalid Solidity source code',
        details: validation.error
      });
    }
    
    const output = Solc.compile(decodedSourceCode, contractName);

    res.json(output);
    } catch (error) {
      res.status(500).json({ message: "Compilation failed", error:error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
