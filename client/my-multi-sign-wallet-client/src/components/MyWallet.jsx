import './MyWallet.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ethers, utils } from "ethers";
import { myWalletAbi } from './MyWalletAbi.js';
import { useEffect, useState } from 'react';
import { formatEther } from 'ethers/lib/utils';
const MyWallet = () => {
  window.ethereum.enable();
  const myWalletContractAddress = "0xA74A0d3Ce292df52Ddb9989bCe31A97ed6a6edbb";
  let signer;
  let provider;
  let myWalletContract;
  let myWalletContractWithSigner;
  const [myAddress, setMyAddress] = useState("");
  const [erc20Address, setErc20Address] = useState("");
  const [erc20Name, setErc20Name] = useState("");
  const [erc20Symbol, setErc20Symbol] = useState("");
  const [allowAddress, setAllowAddress] = useState("");
  const [allowSymbol, setAllowSymbol] = useState("");


  useEffect(async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum)
    signer = provider.getSigner();

    myWalletContract = new ethers.Contract(myWalletContractAddress, myWalletAbi, provider);
    myWalletContractWithSigner = myWalletContract.connect(signer);
    console.log(myWalletContractWithSigner)
    const filter = {
      address: myWalletContractAddress,
      topics: [
        // the name of the event, parnetheses containing the data type of each event, no spaces
        utils.id("AddNewToken(address creationAddress,string name,address tokenAddress,string symbol)")
      ]
    }
    myWalletContract.on(filter, (from, to, amount, event) => {
      // The to will always be "address"
      console.log(`I got ${formatEther(amount)} from ${from}.`);
    });
    console.log(await myWalletContract.tokens("DAI"));
    setMyAddress(await signer.getAddress());
  }, [])
  const addContract = async (e) => {
    e.preventDefault();
    console.log(myWalletContractWithSigner);
    await myWalletContractWithSigner.addToken(erc20Name, erc20Address, erc20Symbol);
  }

  const allowAddressClick = async (e) => {
    try {

      e.preventDefault();
      await myWalletContractWithSigner.allowUserToManageMyTokens(allowSymbol, allowAddress);
    }
    catch (ex) {
      toast.error(ex.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

  }
  const connect = async (e) => {
    e.preventDefault();

  }
  return (
    <div className="container-fluid">

      <h2>My Wallet - {myAddress}</h2>
      <h3>ERC-20 Token</h3>
      <form>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">ERC20 Name</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" onChange={e => setErc20Name(e.target.value)} value={erc20Name}></input>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">ERC20 Symbol</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" onChange={e => setErc20Symbol(e.target.value)} value={erc20Symbol}></input>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">ERC20 Address</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" onChange={e => setErc20Address(e.target.value)} value={erc20Address}></input>
          </div>
        </div>

        <button onClick={addContract} className="btn btn-success">Add ERC-20 Token</button>

      </form>
      <hr></hr>
      <form>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Allow Address to Symbol (Symbol Token)</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" onChange={e => setAllowSymbol(e.target.value)} value={allowSymbol}></input>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Allow Address</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" onChange={e => setAllowAddress(e.target.value)} value={allowAddress}></input>
          </div>
        </div>


        <button onClick={allowAddressClick} className="btn btn-success">Allow Address</button>

      </form>
      <hr></hr>

      <button onClick={connect} className="btn btn-success">Connect</button>

    </div >
  );
}

export default MyWallet;
