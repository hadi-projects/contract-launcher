import { Request, Response } from "express";
import ContractService from "server/service/contract";

export default class ContractController {
  async deploy(req: Request, res: Response) {
    try {
      const { abi, bytecode, rpcUrl, privateKey, parameters } = req.body;
      const result = await ContractService.deploy({rpcUrl, privateKey, abi, bytecode, parameters})

      res.json({
        "status": "Success",
        "Data": result
      });
    } catch (error) {
      res.status(500).json({ message: "Deploy failed", error: error });
    }
  }
  async interact(req: Request, res: Response) {
    try {
      let { methodName, parameters, abi, rpcUrl, privateKey, contractAddress } = req.body;

      if(!parameters){
        parameters = []
      }

      const result = await ContractService.interact({
        abi, 
        parameters, 
        rpcUrl, 
        privateKey,
        contractAddress,
        methodName
      })

      console.log(result);
      

      res.json({
        "status": "Success",
        "Data": result[0]
      });
    } catch (error) {
      res.status(500).json({ message: "Interaction failed", error: error });
    }
  }
}
