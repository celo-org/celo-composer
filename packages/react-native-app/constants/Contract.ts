// Tether (USDT)
const contractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";

// vitalik.eth
const balanceAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

const readContractAbi = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                name: "",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "balance",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];

const getFilterChangesAbi = [
    "event Transfer(address indexed from, address indexed to, uint amount)",
];

export default {
    contractAddress,
    balanceAddress,
    readContractAbi,
    getFilterChangesAbi,
};
