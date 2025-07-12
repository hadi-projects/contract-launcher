import solc from 'solc';

export default class Solc {
    constructor(){}

    static compile(source:string, contractName:string){
        try {
            // Konfigurasi input untuk solc
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
        
            // Kompilasi contract
            const output = JSON.parse(solc.compile(JSON.stringify(input)));
        
            console.log(output);
            
            // Cek jika ada error
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