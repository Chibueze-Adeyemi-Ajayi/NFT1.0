import {ethers} from "ethers";
import {abi} from "../../../build/contracts/ERC721smartcontract.json";
import "regenerator-runtime";

const CONTRACT_ADDRESS = "0xE503b3a0f57DFEE7e2387f27BF371ac368f41Aa3";
const provider = new ethers.providers.Web3Provider(window.ethereum);

//initializing, account request
(async () => {
  await provider.send("eth_requestAccounts", []);
})();

const signer = provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

async function getNonce () {
  const nonce_ = await signer.getTransactionCount();
  return nonce_;
}

async function getGasPrice ()
{
  const price = await provider.getGasPrice();
  return price;
}

async function getChainId ()
{
  const network = await provider.getNetwork();
  return network.chainId;
}

async function getAddress ()
{
  const address = await signer.getAddress();
  return address;
}

async function mintNFT (amount)
{

    const address = await getAddress();
    const nonce = await getNonce();
    const chainID = await getChainId();
    const gasPrice = await getGasPrice();

    const overrides = {
      from: address,
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: ethers.utils.hexlify("0x100000"),
      value: ethers.utils.parseEther("0.01")
    }

    const tx = await contract.populateTransaction.mint(address, amount, overrides);
    const signTX = await signer.sendTransaction(tx);
    const receipt = await signTX.wait();

    if (receipt) console.log("NFT Minted successfully");
    else console.log("Couldn't mint NFT dude");

}

async function listNFTs ()
{

  const address = await getAddress();
  const ids = await contract.functions.walletOfOwner(address);
  var text = "";
  
  ids[0].forEach(async id => {
    const uri = await contract.functions.tokenURI(id);
    text = uri + "<br>";
    console.log(uri);
  });

  return text;

}

document.querySelector("#mint-btn").addEventListener("click", async () => {
  const x = document.querySelector("#nft-count").value;
  const count = (x > 0)? x : 1;
  mintNFT(count)
});

document.querySelector("#nft-list-btn").addEventListener("click", async () => {
  const container = document.querySelector("#nfts");
  const nfts = await listNFTs();
  container.innerHTML = nfts;
});