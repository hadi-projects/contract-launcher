import { Request, Response } from "express";
import ContractService from "server/service/contract";

export default class ContractController {
    async deploy(req:Request, res:Response){
        try {
            const {abi, bytecode, rpcUrl, privateKey, constructor } = req.body;

            const result = await ContractService.deploy(rpcUrl, privateKey, abi, bytecode, constructor)
            res.json({
              "status":"Success",
              "Address": result
            });
            } catch (error) {
              res.status(500).json({ message: "Deploy failed", error:error });
            }
    }
}
