export default function validateSolidityCode(sourceCode: string): { isValid: boolean; error?: string } {
    // Cek apakah kode mengandung pragma dasar dan sintaks contract
    const hasPragma = sourceCode.match(/pragma\s+solidity/i);
    const hasContract = sourceCode.match(/contract\s+\w+/i);
    
    if (!hasPragma) {
        return { isValid: false, error: 'Missing Solidity pragma statement' };
    }
    if (!hasContract) {
        return { isValid: false, error: 'No contract definition found' };
    }
    
    // Tambahan validasi dasar: panjang kode minimal
    if (sourceCode.length < 50) {
        return { isValid: false, error: 'Source code is too short to be valid' };
    }
    
    return { isValid: true };
}