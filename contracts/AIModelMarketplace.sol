// SPDX-License-Identifier: UNKNOWN 
pragma solidity ^0.8.0;


contract AIModelMarketplace {
    struct AIModel {
        uint id;
        string name;
        string description;
        uint price;
        address payable owner;
        uint ratingSum;
        uint ratingCount;
    }

    uint public modelCount;
    mapping(uint => AIModel) public models;
    mapping(address => mapping(uint256 => bool)) public purchases;
    mapping(address => uint256) public pendingWithdrawals;

    event ModelListed(uint id, string name, string description, uint price, address owner);
    event FundWithdrawn(address owner, uint amount);
    
    function listModel(string memory _name, string memory _description, uint _price) public {
        require(_price > 0, "Price must be greater than zero");
        
        modelCount++;
        models[modelCount] = AIModel(modelCount, _name, _description, _price, payable(msg.sender), 0, 0);
        
        emit ModelListed(modelCount, _name, _description, _price, msg.sender);
    }

    function purchaseModel(uint256 _id) public payable {
    AIModel storage model = models[_id];
    require(msg.value >= model.price, "Insufficient funds to purchase model");
    purchases[msg.sender][_id] = true;
    pendingWithdrawals[model.owner] += msg.value;
   
}

    function rateModel(uint _id, uint _rating) public {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        
        AIModel storage model = models[_id];
        model.ratingSum += _rating;
        model.ratingCount++;
    }

    function getModelRating(uint256 _id) public view returns (uint) {
        AIModel storage model = models[_id];
        return model.ratingCount > 0 ? model.ratingSum / model.ratingCount : 0;
    }

    function withdrawFunds() public {
    uint256 amount = pendingWithdrawals[msg.sender];
    require(amount > 0, "No funds to withdraw");

    pendingWithdrawals[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
}
}

