import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { cryptoZombiesABI } from './cryptozombies_abi';
import './ZombieApp.css'; // Import the CSS file for styling

const ZombieApp = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [cryptoZombies, setCryptoZombies] = useState(null);
  const [zombies, setZombies] = useState([]);
  const [txStatus, setTxStatus] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          setWeb3(web3);
          setAccount(accounts[0]);
          const cryptoZombiesAddress = "0x2fa0F28e4495931695980d147E2C7647E7299494"; // Replace with your deployed contract address
          const cryptoZombies = new web3.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);
          setCryptoZombies(cryptoZombies);
          console.log("Contract instance initialized:", cryptoZombies);
        } catch (error) {
          console.error("User denied account access or other error:", error);
        }
      } else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);
        const accounts = await web3.eth.getAccounts();
        setWeb3(web3);
        setAccount(accounts[0]);
        const cryptoZombiesAddress = "0x2fa0F28e4495931695980d147E2C7647E7299494"; // Replace with your deployed contract address
        const cryptoZombies = new web3.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);
        setCryptoZombies(cryptoZombies);
        console.log("Contract instance initialized:", cryptoZombies);
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    };

    initWeb3();
  }, []);

  const getZombiesByOwner = async (owner) => {
    if (!cryptoZombies) {
      console.error("Contract instance not initialized");
      return;
    }
    try {
      console.log("Fetching zombies for owner:", owner);
      const ids = await cryptoZombies.methods.getZombiesByOwner(owner).call();
      console.log("Zombie IDs fetched:", ids);
      const zombieDetails = await Promise.all(ids.map(async (id) => {
        const zombie = await cryptoZombies.methods.zombies(id).call();
        return { id: id.toString(), ...zombie };
      }));
      console.log("Zombie details fetched:", zombieDetails);
      setZombies(zombieDetails);
    } catch (error) {
      console.error("Error fetching zombies:", error);
      setTxStatus("Error fetching zombies: " + error.message);
    }
  };

  const createRandomZombie = async (name) => {
    if (!cryptoZombies) {
      console.error("Contract instance not initialized");
      return;
    }
    setTxStatus("Creating new zombie on the blockchain. This may take a while...");
    try {
      console.log("Account:", account);
      await cryptoZombies.methods.createRandomZombie(name).send({ from: account, gas: 3000000 })
        .on('transactionHash', function(hash){
          console.log("Transaction hash:", hash);
        })
        .on('receipt', function(receipt){
          console.log("Transaction receipt:", receipt);
          setTxStatus("Successfully created " + name + "!");
          getZombiesByOwner(account);
        })
        .on('error', function(error, receipt) {
          console.error("Error creating zombie:", error);
          console.error("Transaction receipt:", receipt);
          setTxStatus("Error creating zombie: " + error.message);
        });
    } catch (error) {
      console.error("Error creating zombie:", error);
      setTxStatus("Error creating zombie: " + error.message);
    }
  };

  const levelUp = async (zombieId) => {
    if (!cryptoZombies) {
      console.error("Contract instance not initialized");
      return;
    }
    if (!zombieId) {
      console.error("Invalid zombie ID:", zombieId);
      setTxStatus("Invalid zombie ID");
      return;
    }
    setTxStatus("Leveling up your zombie...");
    try {
      console.log("Leveling up zombie with ID:", zombieId);
      await cryptoZombies.methods.levelUp(zombieId).send({ from: account, value: web3.utils.toWei("0.001", "ether"), gas: 3000000 })
        .on('transactionHash', function(hash){
          console.log("Transaction hash:", hash);
        })
        .on('receipt', function(receipt){
          console.log("Transaction receipt:", receipt);
          setTxStatus("Power overwhelming! Zombie successfully leveled up");
          getZombiesByOwner(account);
        })
        .on('error', function(error, receipt) {
          console.error("Error leveling up zombie:", error);
          console.error("Transaction receipt:", receipt);
          setTxStatus("Error leveling up zombie: " + error.message);
        });
    } catch (error) {
      console.error("Error leveling up zombie:", error);
      setTxStatus("Error leveling up zombie: " + error.message);
    }
  };

  return (
    <div className="container spooky-background">
      <div className="alert alert-info" role="alert">{txStatus}</div>
      <div className="row">
        {zombies.map((zombie, index) => (
          <div className="col-md-4 zombie-card" key={index}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Name: {zombie.name}</h5>
                <p className="card-text">DNA: {zombie.dna}</p>
                <p className="card-text">Level: {zombie.level}</p>
                <p className="card-text">Wins: {zombie.winCount}</p>
                <p className="card-text">Losses: {zombie.lossCount}</p>
                <p className="card-text">Ready Time: {zombie.readyTime}</p>
                <button className="btn btn-warning" onClick={() => levelUp(zombie.id)}>Level Up</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="btn-group spooky-buttons" role="group" aria-label="Zombie Actions">
        <button className="btn btn-primary spooky-button" onClick={() => getZombiesByOwner(account)}>Show Zombies</button>
        <button className="btn btn-success spooky-button" onClick={() => createRandomZombie("Zombie" + Math.floor(Math.random() * 1000))}>Create Zombie</button>
      </div>
    </div>
  );
};

export default ZombieApp;