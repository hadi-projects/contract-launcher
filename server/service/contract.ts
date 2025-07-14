import { ethers, InterfaceAbi } from 'ethers';
import ContractProperty from 'server/model/contract-model';

export default class ContractService {
    constructor() { }

    static async deploy(data: ContractProperty) {
        try {
            const provider = new ethers.JsonRpcProvider(data.rpcUrl);
            const signer = new ethers.Wallet(data.privateKey as string, provider);
            const MyContractFactory = new ethers.ContractFactory(data.abi as InterfaceAbi, data.bytecode as string, signer);

            const myContract = await MyContractFactory.deploy(...data.parameters as string[]);

            await myContract.waitForDeployment();

            console.log(`MyContract deployed to: ${myContract.target}`);
            console.log(`Transaction hash: ${myContract.deploymentTransaction()?.hash}`);

            return myContract.target
        } catch (error) {
            console.error('Error during deployment:', error);
        }
    }
    static async interact(data:ContractProperty) {
        try {
          const provider = new ethers.JsonRpcProvider(data.rpcUrl);
          const wallet = new ethers.Wallet(data.privateKey as string, provider);
    
          const contract = new ethers.Contract(data.contractAddress as string, data.abi as any[], wallet);
    
          if (!contract.interface.hasFunction(data.methodName as string)) {
            throw new Error(`Method ${data.methodName as string} not found in contract ABI`);
          }

          const result = await contract[data.methodName as string](...data.parameters as string[]);
    
          if (result.wait) {
            const txReceipt = await result.wait();
            return {
              transactionHash: txReceipt.transactionHash,
              result: await contract[data.methodName as string].staticCall(...data.parameters as string[]) 
            };
          }
    
          return result;
        } catch (error) {
          throw new Error(`Contract interaction failed: ${error}`);
        }
      }
}