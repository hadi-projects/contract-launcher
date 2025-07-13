import { ethers } from 'ethers';

export default class ContractService {
    constructor() { }

    static async deploy(rpcUrl: string, privateKey: string, abi: string, bytecode: string, constructor:string[]) {
        try {
            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const signer = new ethers.Wallet(privateKey, provider);
            const MyContractFactory = new ethers.ContractFactory(abi, bytecode, signer);

            const myContract = await MyContractFactory.deploy(constructor[0], constructor[1], constructor[2]);

            await myContract.waitForDeployment();

            console.log(`MyContract deployed to: ${myContract.target}`);
            console.log(`Transaction hash: ${myContract.deploymentTransaction()?.hash}`);

            return myContract.target

        } catch (error) {
            console.error('Error during deployment:', error);
        }
    }
}