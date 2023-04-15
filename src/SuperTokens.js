import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  Spinner,
  Card
} from "react-bootstrap";
import { daiABI } from "./config";
import "./createFlow.css";
import { ethers } from "ethers";

let account;

//where the Superfluid logic takes place
async function upgradeTokens(amount) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider
  });

  const superSigner = sf.createSigner({ signer: signer });

  console.log(signer);
  console.log(await superSigner.getAddress());
  const daix = await sf.loadSuperToken("fDAIx");

  console.log(daix);

  try {
    const upgradeOperation = daix.upgrade({
      amount: amount
    });

    console.log("Upgrading...");

    await upgradeOperation.exec(signer);

    console.log(
      `Congrats - you've just upgraded your tokens to an Index!
         Network: Goerli
         Super Token: DAIx
         Amount: ${amount}         
      `
    );

    console.log(
      `Congrats - you've just distributed to your index!
    `
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}

//where the Superfluid logic takes place
async function downgradeTokens(amount) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider
  });

  const superSigner = sf.createSigner({ signer: signer });

  console.log(signer);
  console.log(await superSigner.getAddress());
  const daix = await sf.loadSuperToken("fDAIx");

  console.log(daix);

  try {
    const downgradeOperation = daix.downgrade({
      amount: amount
    });

    console.log("downgrading...");

    await downgradeOperation.exec(signer);

    console.log(
      `Congrats - you've just downgraded your tokens
         Network: Goerli
         Super Token: DAIx
         Amount: ${amount}         
      `
    );

    console.log(
      `Congrats - you've just downgraded
    `
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}

async function approveTokens(amount) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider
  });

  const superSigner = sf.createSigner({ signer: signer });

  console.log(signer);
  console.log(await superSigner.getAddress());

  //fDAI on goerli: you can find network addresses here: https://docs.superfluid.finance/superfluid/developers/networks
  //note that this abi is the one found here: https://goerli.etherscan.io/address/0x88271d333C72e51516B67f5567c728E702b3eeE8
  const DAI = new ethers.Contract(
    "0x88271d333C72e51516B67f5567c728E702b3eeE8",
    daiABI,
    signer
  );
  try {
    console.log("approving DAI spend");
    await DAI.approve(
      "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
      ethers.utils.parseEther(amount.toString())
    ).then(function (tx) {
      console.log(
        `Congrats, you just approved your DAI spend. You can see this tx at https://kovan.etherscan.io/tx/${tx.hash}`
      );
    });
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}

export const SuperTokens = () => {
  const [approveAmount, setApproveAmount] = useState("");
  const [upgradeAmount, setUpgradeAmount] = useState("");
  const [downgradeAmount, setDowngradeAmount] = useState("");
  const [isApproveButtonLoading, setIsApproveButtonLoading] = useState(false);
  const [isUpgradeButtonLoading, setIsUpgradeButtonLoading] = useState(false);
  const [isDowngradeButtonLoading, setIsDowngradeButtonLoading] = useState(
    false
  );
  const [currentAccount, setCurrentAccount] = useState("");

  function UpgradeButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isUpgradeButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  function DowngradeButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isDowngradeButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  function ApproveButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isApproveButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleApproveAmountChange = (e) => {
    setApproveAmount(() => ([e.target.name] = e.target.value));
  };

  const handleUpgradeAmountChange = (e) => {
    setUpgradeAmount(() => ([e.target.name] = e.target.value));
  };

  const handleDowngradeAmountChange = (e) => {
    setDowngradeAmount(() => ([e.target.name] = e.target.value));
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      account = currentAccount;
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      // setupEventListener()
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    console.log("runs");
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    let chainId = chain;
    console.log("chain ID:", chain);
    console.log("global Chain Id:", chainId);
    if (accounts.length !== 0) {
      account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      // setupEventListener()
    } else {
      console.log("No authorized account found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div>
      <h2>Working with Super Tokens</h2>
      {currentAccount === "" ? (
        <button id="connectWallet" className="button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <Card className="connectedWallet">
          {`${currentAccount.substring(0, 4)}...${currentAccount.substring(
            38
          )}`}
        </Card>
      )}
      <Form>
        <FormGroup className="mb-3">
          <FormControl
            name="subscriber"
            value={approveAmount}
            onChange={handleApproveAmountChange}
            placeholder="Enter approve amount"
          ></FormControl>
        </FormGroup>
        <p>
          <ApproveButton
            onClick={() => {
              setIsApproveButtonLoading(true);
              approveTokens(approveAmount);
              setTimeout(() => {
                setIsApproveButtonLoading(false);
              }, 1000);
            }}
          >
            Click to Approve
          </ApproveButton>
        </p>
      </Form>
      <Form>
        <FormGroup className="mb-3">
          <FormControl
            name="subscriber"
            value={upgradeAmount}
            onChange={handleUpgradeAmountChange}
            placeholder="Enter Upgrade amount"
          ></FormControl>
        </FormGroup>
        <UpgradeButton
          onClick={() => {
            setIsUpgradeButtonLoading(true);
            upgradeTokens(downgradeAmount);
            setTimeout(() => {
              setIsUpgradeButtonLoading(false);
            }, 1000);
          }}
        >
          Click to Upgrade
        </UpgradeButton>
      </Form>
      <Form>
        <FormGroup className="mb-3">
          <FormControl
            name="subscriber"
            value={downgradeAmount}
            onChange={handleDowngradeAmountChange}
            placeholder="Enter Downgrade amount"
          ></FormControl>
        </FormGroup>
        <DowngradeButton
          onClick={() => {
            setIsUpgradeButtonLoading(true);
            downgradeTokens(downgradeAmount);
            setTimeout(() => {
              setIsUpgradeButtonLoading(false);
            }, 1000);
          }}
        >
          Click to Downgrade
        </DowngradeButton>
      </Form>

      <div className="description">
        <p>
          Go to the SuperTokens.js component and look at the
          <b> upgrade and approve </b>
          functions to see under the hood
        </p>
      </div>
    </div>
  );
};
