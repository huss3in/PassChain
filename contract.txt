pragma solidity ^0.4.0;

contract PassChain {
    mapping (address => uint) balances;
    mapping (address => string) Passes;
    mapping (address => string) Logs;
    
    function getPasses() constant public returns(string){
        return Passes[msg.sender];
    }
    
    function addPass(string Pass, address receiver) public {
        Passes[receiver] = Pass;
    }
    
    function getLogs() constant public returns(string){
        return Logs[msg.sender];
    }
    
    function addLogs(string Log) public {
        Logs[msg.sender] = Log;
    }
    
    function getBalance() constant public returns(uint){
        return balances[msg.sender];
    }
    
    function charge() public {
        balances[msg.sender] += 100;
    }
    
    function transfer(address _to, uint256 _value) public {
        require(balances[msg.sender] >= _value);           // Check if the sender has enough
        require(balances[_to] + _value >= balances[_to]); // Check for overflows
        balances[msg.sender] -= _value;                    // Subtract from the sender
        balances[_to] += _value;                           // Add the same to the recipient
    }
}