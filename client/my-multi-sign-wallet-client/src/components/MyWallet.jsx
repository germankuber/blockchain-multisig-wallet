import './MyWallet.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import detectEthereumProvider from '@metamask/detect-provider';

import { ethers, utils } from "ethers";
import { myWalletAbi } from './MyWalletAbi.js';
import { useEffect, useState } from 'react';
const MyWallet = () => {

  window.ethereum.enable();
  const myWalletContractAddress = "0xA74A0d3Ce292df52Ddb9989bCe31A97ed6a6edbb";
  let signer;
  let provider;
  let myWalletContract;
  let myWalletContractWithSigner;
  const [myAddress, setMyAddress] = useState("");
  const [daiAmount, setDaiAmount] = useState(0);
  const [erc20Address, setErc20Address] = useState("");
  const [erc20Name, setErc20Name] = useState("");
  const [erc20Symbol, setErc20Symbol] = useState("");
  const [allowAddress, setAllowAddress] = useState("");
  const [allowSymbol, setAllowSymbol] = useState("");
  const [transferSymbol, setTransferSymbol] = useState("");
  const [transferOrigin, setTransferOrigin] = useState("");
  const [transferDestination, setTransferDestination] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [depositSymbol, setDepositSymbol] = useState("");
  const [depositAmount, setDepositAmount] = useState("");



  useEffect(async () => {
    await setup();
    const providerMetamask = await detectEthereumProvider();

    window.ethereum.on('accountsChanged', async (accounts) => {
      window.location.reload();
    });

  }, [])
  const setup = async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum)
    signer = provider.getSigner();

    myWalletContract = new ethers.Contract(myWalletContractAddress, myWalletAbi, provider);
    myWalletContractWithSigner = myWalletContract.connect(signer);
    // const filter = {
    //   address: myWalletContractAddress,
    //   topics: [
    //     // the name of the event, parnetheses containing the data type of each event, no spaces
    //     utils.id("AddNewToken(address creationAddress,string name,address tokenAddress,string symbol)")
    //   ]
    // }
    // myWalletContract.on(filter, (from, to, amount, event) => {
    //   // The to will always be "address"
    //   console.log(`I got ${formatEther(amount)} from ${from}.`);
    // });
    console.log(await myWalletContract.tokens("DAI"));
    const address = await signer.getAddress();
    setMyAddress(address);
    const balance = await myWalletContractWithSigner.userTokenBalancePerToken(address, "DAI");
    setDaiAmount(ethers.utils.formatEther(balance));
  }
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
      console.error(ex.message);
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
    await setup();
  }

  const transfer = async (e) => {
    e.preventDefault();
    try {
      await myWalletContractWithSigner.transferToken(transferOrigin, transferDestination, transferSymbol, transferAmount);
    } catch (ex) {
      console.log(ex);
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

  const depositToken = async (e) => {
    e.preventDefault();
    try {
      console.log(myWalletContractWithSigner);
      console.log(depositSymbol)
      console.log(depositAmount)
      await myWalletContractWithSigner.depositToken(depositSymbol, 1);
    } catch (ex) {
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
  return (
    <div className="container-fluid">

      <h2>My Wallet - {myAddress}</h2>
      <h3>ERC-20 Token</h3>
      <h4>DAI - {daiAmount}</h4>
      <hr></hr>
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
      <form>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Origin</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" onChange={e => setTransferOrigin(e.target.value)} value={transferOrigin}></input>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Destination</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" onChange={e => setTransferDestination(e.target.value)} value={transferDestination}></input>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Allow Address to Symbol (Symbol Token)</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" onChange={e => setTransferSymbol(e.target.value)} value={transferSymbol}></input>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Amount</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" onChange={e => setTransferAmount(e.target.value)} value={transferAmount}></input>
          </div>
        </div>
        <button onClick={transfer} className="btn btn-success">Transfer</button>
      </form>
      <hr></hr>

      <form>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Symbol to deposit (use DAI)</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" onChange={e => setDepositSymbol(e.target.value)} value={depositSymbol}></input>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Amount to deposit</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" onChange={e => setDepositAmount(e.target.value)} value={depositAmount}></input>
          </div>
        </div>
        <button onClick={depositToken} className="btn btn-success">Deposit</button>
      </form>
      <hr></hr>

      <button onClick={connect} className="btn btn-success">Connect</button>
      <ToastContainer />
    </div >
  );
}

export default MyWallet;
