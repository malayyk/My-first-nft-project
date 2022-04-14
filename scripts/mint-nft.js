require("dotenv").config();
const API_URL = process.env.API_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const contract = require("../artifacts/contracts/MyNft.sol/MyNFT.json")//abi for contract

// console.log(JSON.stringify(contract.abi));

const contract_address = "0x07A4B60e0803070326dAfE16378FFA3CC9AA3581";

const nft_contract = new web3.eth.Contract(contract.abi,contract_address);

async function mintNFT(tokenURI){

    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");

    const tx = {"from":PUBLIC_KEY, 'to':contract_address , 'nonce':nonce, 'gas':5000000, 'data':nft_contract.methods.mintNft(PUBLIC_KEY,tokenURI).encodeABI()};
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise
      .then((signedTx) => {
        web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
          function (err, hash) {
            if (!err) {
              console.log(
                "The hash of your transaction is: ",
                hash,
                "\nCheck Alchemy's Mempool to view the status of your transaction!"
              );
            } else {
              console.log(
                "Something went wrong when submitting your transaction:",
                err
              );
            }
          }
        );
      })
      .catch((err) => {
        console.log(" Promise failed:", err);
      });

      
}
    mintNFT("https://gateway.pinata.cloud/ipfs/QmS2RHUASPVNqyddyBL3uLQ3vPLqZVYXS2Tu5WeSccNmpu");