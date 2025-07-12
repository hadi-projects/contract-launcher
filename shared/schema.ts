import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull().unique(),
  abi: json("abi").notNull(),
  bytecode: text("bytecode"),
  sourceCode: text("source_code"),
  compilationVersion: text("compilation_version"),
  network: text("network").notNull(),
  deployerAddress: text("deployer_address").notNull(),
  deploymentTxHash: text("deployment_tx_hash"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull().unique(),
  type: text("type").notNull(), // 'deploy', 'call', 'send'
  contractAddress: text("contract_address"),
  functionName: text("function_name"),
  parameters: json("parameters"),
  gasUsed: integer("gas_used"),
  gasPrice: text("gas_price"),
  value: text("value"),
  status: text("status").notNull(), // 'pending', 'success', 'failed'
  network: text("network").notNull(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address"),
  blockNumber: integer("block_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contractTemplates = pgTable("contract_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  sourceCode: text("source_code").notNull(),
  abi: json("abi").notNull(),
  constructorParams: json("constructor_params"),
  tags: json("tags"),
  isAudited: boolean("is_audited").default(false),
  difficulty: text("difficulty").notNull(), // 'standard', 'advanced'
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertContractTemplateSchema = createInsertSchema(contractTemplates).omit({
  id: true,
});

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertContractTemplate = z.infer<typeof insertContractTemplateSchema>;
export type ContractTemplate = typeof contractTemplates.$inferSelect;
