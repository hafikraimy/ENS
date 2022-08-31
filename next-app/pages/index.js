import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";

export default function Home() {
  const [ens, setENS] = useState("");
  const [address, setAddress] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  const setENSOrAddress = async (address, web3Provider) => {
    try {
      // lookup the ENS related to the given address
      const _ens = await web3Provider.lookupAddress(address);
      if (_ens) {
        setENS(_ens);
      } else {
        setAddress(address);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProviderOrSigner = async () => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      const { chainId } = await web3Provider.getNetwork();
      if (chainId != 5) {
        window.alert("Change the network to goerli");
        throw new Error("Change the network to goerli");
      }

      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();
      setENSOrAddress(address, web3Provider);
      return signer;
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      return <div>Wallet connected</div>;
    } else {
      return (
        <button className={styles.button} onClick={connectWallet}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
    connectWallet();
  }, walletConnected);

  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            Its an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Ahmad Hafik Raimy
      </footer>
    </div>
  );
}
