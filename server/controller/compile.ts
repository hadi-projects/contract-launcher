import { Request, Response } from "express";
import Solc from "server/service/solc";
import validateSolidityCode from "server/validation/contract";

export default class CompileController {
    async compile(req:Request, res:Response){
        try {
            const { sourceCode, solidityVersion, contractName, isBase64 = true } = req.body;
        
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
    }
}

