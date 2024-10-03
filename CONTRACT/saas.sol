// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract saas{
    address[] registered;
    mapping(address=>uint) public balance;

    function register() public {
        registered.push(msg.sender);
        balance[msg.sender] = 0;
    }

    struct question{
        uint id;
        address owner;
        uint amount;
    }

    mapping(uint=>question) public questions;


    function upload(uint _id) public payable {
        require(msg.value!=0 && balance[msg.sender]>=0);
        questions[_id] = question(_id,msg.sender,msg.value);
    }

    mapping(uint => address[]) public responses;
    
    function respond(uint _id) public{
        require(balance[msg.sender]>=0);
        responses[_id].push(msg.sender);
    }

    function dispurse(uint _id) public{
        uint companyCut = (20*questions[_id].amount)/100;
        uint dis = (questions[_id].amount - companyCut)/(responses[_id].length);
        for(uint i=0;i<(responses[_id].length);i++){
            address ii = responses[_id][i];
            balance[ii] += dis;
        }
    }
    
    function withdraw(uint _amount) public {
        require(balance[msg.sender]>=_amount);
        balance[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

}
