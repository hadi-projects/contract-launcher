// Fungsi untuk mengencode source code ke Base64
function encodeToBase64(sourceCode) {
    return Buffer.from(sourceCode).toString('base64');
}

// Fungsi utama untuk membaca file Solidity dan mengencode ke Base64
function prepareSolidityPayload(contractName, solidityVersion) {
    try {
        // Baca file Solidity
        const sourceCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleWallet {
    // Mapping untuk menyimpan saldo setiap alamat
    mapping(address => uint256) private balances;

    // Event untuk mencatat transaksi deposit dan withdraw
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    // Fungsi untuk deposit ether ke wallet
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Fungsi untuk withdraw ether dari wallet
    function withdraw(uint256 amount) public {
        require(amount > 0, "Withdraw amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    // Fungsi untuk memeriksa saldo
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}`
        
        // Encode ke Base64
        const encodedCode = encodeToBase64(sourceCode);
        
        // Buat payload untuk API
        const payload = {
            sourceCode: encodedCode,
            solidityVersion: solidityVersion,
            contractName: contractName,
            isBase64: true // Flag untuk memberi tahu API bahwa source code dalam Base64
        };
        
        // // Simpan payload ke file (opsional)
        // const outputPath = path.resolve(path.dirname(inputPath), 'SolidityPayload.json');
        // fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));
        
        // console.log('Payload saved to:', outputPath);
        console.log('Payload for Postman:');
        console.log(JSON.stringify(payload, null, 2));
        
        return payload;
    } catch (error) {
        console.error('Error preparing payload:', error.message);
        throw error;
    }
}

// Contoh penggunaan
prepareSolidityPayload('SimpleWallet', '0.8.0');



/// output
// {
//     "sourceCode": "Ly8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1JVApwcmFnbWEgc29saWRpdHkgXjAuOC4wOwoKY29udHJhY3QgU2ltcGxlV2FsbGV0IHsKICAgIC8vIE1hcHBpbmcgdW50dWsgbWVueWltcGFuIHNhbGRvIHNldGlhcCBhbGFtYXQKICAgIG1hcHBpbmcoYWRkcmVzcyA9PiB1aW50MjU2KSBwcml2YXRlIGJhbGFuY2VzOwoKICAgIC8vIEV2ZW50IHVudHVrIG1lbmNhdGF0IHRyYW5zYWtzaSBkZXBvc2l0IGRhbiB3aXRoZHJhdwogICAgZXZlbnQgRGVwb3NpdChhZGRyZXNzIGluZGV4ZWQgdXNlciwgdWludDI1NiBhbW91bnQpOwogICAgZXZlbnQgV2l0aGRyYXcoYWRkcmVzcyBpbmRleGVkIHVzZXIsIHVpbnQyNTYgYW1vdW50KTsKCiAgICAvLyBGdW5nc2kgdW50dWsgZGVwb3NpdCBldGhlciBrZSB3YWxsZXQKICAgIGZ1bmN0aW9uIGRlcG9zaXQoKSBwdWJsaWMgcGF5YWJsZSB7CiAgICAgICAgcmVxdWlyZShtc2cudmFsdWUgPiAwLCAiRGVwb3NpdCBhbW91bnQgbXVzdCBiZSBncmVhdGVyIHRoYW4gMCIpOwogICAgICAgIGJhbGFuY2VzW21zZy5zZW5kZXJdICs9IG1zZy52YWx1ZTsKICAgICAgICBlbWl0IERlcG9zaXQobXNnLnNlbmRlciwgbXNnLnZhbHVlKTsKICAgIH0KCiAgICAvLyBGdW5nc2kgdW50dWsgd2l0aGRyYXcgZXRoZXIgZGFyaSB3YWxsZXQKICAgIGZ1bmN0aW9uIHdpdGhkcmF3KHVpbnQyNTYgYW1vdW50KSBwdWJsaWMgewogICAgICAgIHJlcXVpcmUoYW1vdW50ID4gMCwgIldpdGhkcmF3IGFtb3VudCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwIik7CiAgICAgICAgcmVxdWlyZShiYWxhbmNlc1ttc2cuc2VuZGVyXSA+PSBhbW91bnQsICJJbnN1ZmZpY2llbnQgYmFsYW5jZSIpOwogICAgICAgIAogICAgICAgIGJhbGFuY2VzW21zZy5zZW5kZXJdIC09IGFtb3VudDsKICAgICAgICBwYXlhYmxlKG1zZy5zZW5kZXIpLnRyYW5zZmVyKGFtb3VudCk7CiAgICAgICAgZW1pdCBXaXRoZHJhdyhtc2cuc2VuZGVyLCBhbW91bnQpOwogICAgfQoKICAgIC8vIEZ1bmdzaSB1bnR1ayBtZW1lcmlrc2Egc2FsZG8KICAgIGZ1bmN0aW9uIGdldEJhbGFuY2UoKSBwdWJsaWMgdmlldyByZXR1cm5zICh1aW50MjU2KSB7CiAgICAgICAgcmV0dXJuIGJhbGFuY2VzW21zZy5zZW5kZXJdOwogICAgfQp9",
//     "solidityVersion": "0.8.0",
//     "contractName": "SimpleWallet",
//     "isBase64": true
//   }