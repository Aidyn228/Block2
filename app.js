const contractABI = [{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  "name": "FundWithdrawn",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "id",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "name",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "description",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "price",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "address",
      "name": "owner",
      "type": "address"
    }
  ],
  "name": "ModelListed",
  "type": "event"
},
{
  "inputs": [],
  "name": "modelCount",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "models",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "id",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "name",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "description",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "price",
      "type": "uint256"
    },
    {
      "internalType": "address payable",
      "name": "owner",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "ratingSum",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "ratingCount",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "name": "pendingWithdrawals",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "purchases",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "_name",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_description",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "_price",
      "type": "uint256"
    }
  ],
  "name": "listModel",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_id",
      "type": "uint256"
    }
  ],
  "name": "purchaseModel",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function",
  "payable": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_id",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "_rating",
      "type": "uint256"
    }
  ],
  "name": "rateModel",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "_id",
      "type": "uint256"
    }
  ],
  "name": "getModelRating",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "withdrawFunds",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];
const contractAddress = '0x007f271FF639eC6206FAB6bbE451791AEEfAc308';

let web3;
let contract;


async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        contract = new web3.eth.Contract(contractABI, contractAddress);
        loadModels();
    } else {
        alert('Please install MetaMask!');
    }
}

async function loadModels() {
    const modelCount = await contract.methods.modelCount().call();
    const modelList = document.getElementById('modelList');
    modelList.innerHTML = '';

    for (let i = 1; i <= modelCount; i++) {
        const model = await contract.methods.models(i).call();
        const averageRating = await contract.methods.getModelRating(i).call(); // Fetch the average rating
        const modelItem = document.createElement('div');
        modelItem.className = 'model-item';
        modelItem.innerHTML = `
            <h3>${model.name}</h3>
            <p>${model.description}</p>
            <p>Price: ${web3.utils.fromWei(model.price.toString(), 'ether')} ETH</p>
            <p>Average Rating: ${averageRating ? averageRating : 0} / 5</p> <!-- Display average rating -->
            <button onclick="purchaseModel(${model.id}, ${model.price})">Buy</button>
            <input type="number" id="ratingInput${model.id}" placeholder="Rate (1-5)" min="1" max="5" />
            <button onclick="rateModel(${model.id})">Rate</button>
        `;
        modelList.appendChild(modelItem);
    }
}

async function listModel() {
    const name = document.getElementById('modelName').value;
    const description = document.getElementById('modelDescription').value;
    const price = document.getElementById('modelPrice').value;

    const accounts = await web3.eth.getAccounts();
    await contract.methods.listModel(name, description, web3.utils.toWei(price, 'ether')).send({ from: accounts[0] });

    document.getElementById('modelName').value = '';
    document.getElementById('modelDescription').value = '';
    document.getElementById('modelPrice').value = '';

    loadModels();
}

async function purchaseModel(id, price) {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.purchaseModel(id).send({ from: accounts[0], value: price });
    loadModels();
}

async function rateModel(id) {
    const ratingInput = document.getElementById(`ratingInput${id}`);
    const rating = ratingInput.value;

    if (rating < 1 || rating > 5) {
        alert('Rating must be between 1 and 5.');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    await contract.methods.rateModel(id, rating).send({ from: accounts[0] });
    ratingInput.value = ''; // Clear the input field after rating
    loadModels(); // Reload models to reflect changes
}
async function withdrawFunds() {
  const accounts = await web3.eth.getAccounts();
  
  try {
      await contract.methods.withdrawFunds().send({ from: accounts[0] });
      alert("Funds withdrawn successfully!");
  } catch (error) {
      console.error("Withdraw failed:", error);
      alert("Withdraw failed. " + error.message);
  }
}

// Event Listener for the withdraw button
document.getElementById('withdrawFundsButton').addEventListener('click', withdrawFunds);

// Event Listeners
document.getElementById('listModelButton').addEventListener('click', listModel);

// Initialize Web3 on page load
window.addEventListener('load', initWeb3);
