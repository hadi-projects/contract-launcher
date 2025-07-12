import solc from 'solc';

export default class Solc {
    constructor(){}

    static compile(source:string, contractName:string){
        try {
            const input = {
                language: 'Solidity',
                sources: {
                    [contractName]: {
                        content: source,
                    },
                },
                settings: {
                    outputSelection: {
                        '*': {
                            '*': ['abi', 'evm.bytecode'],
                        },
                    },
                },
            };
        
            const output = JSON.parse(solc.compile(JSON.stringify(input)));
        
            if (output.errors) {
                output.errors.forEach((err: any) => {
                    console.error(err.formattedMessage);
                });
                throw new Error('Compilation failed');
            }

            return output
        
        } catch (error) {
            console.error('Error during compilation:', error);
        }
    }
}