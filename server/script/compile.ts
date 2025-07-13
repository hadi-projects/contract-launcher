import Solc from "server/service/solc";

let sourceCode = `
// SPDX-License-Identifier: MIT
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

console.log(Solc.compile(sourceCode, "SimpleWallet"));
