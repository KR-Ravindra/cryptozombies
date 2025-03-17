
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Button, Spinner } from "react-bootstrap";
import cryptoZombiesABI from "./cryptozombies_abi.js";
import "./ZombieApp.css";

const ZombieApp = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [cryptoZombies, setCryptoZombies] = useState(null);
  const [zombies, setZombies] = useState([]);
  const [txStatus, setTxStatus] = useState("");
  const [selectedZombie, setSelectedZombie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          const contractAddress = "0xe4Fe61048ECF93757A19679e5FB931Bfdea683E3"; // Update if needed
          const contractInstance = new web3Instance.eth.Contract(cryptoZombiesABI, contractAddress);
          setCryptoZombies(contractInstance);
          console.log("Contract initialized:", contractInstance);
        } catch (error) {
          console.error("MetaMask access denied or error:", error);
        }
      } else {
        console.log("MetaMask not detected. Please install it.");
      }
    };

    initWeb3();
  }, []);

  const getZombiesByOwner = async (owner) => {
    if (!cryptoZombies) {
      console.error("Contract not initialized");
      return;
    }
    try {
      setLoading(true);
      console.log("Fetching zombies for owner:", owner);
      const ids = await cryptoZombies.methods.getZombiesByOwner(owner).call();
      const details = await Promise.all(ids.map(async (id) => {
        const zombie = await cryptoZombies.methods.zombies(id).call();
        return { id: id.toString(), ...zombie };
      }));
      setZombies(details);
      setTxStatus("Zombies loaded!");
    } catch (error) {
      console.error("Error fetching zombies:", error);
      setTxStatus("Error fetching zombies: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createRandomZombie = async (name) => {
    if (!cryptoZombies) return;
    setTxStatus("Creating zombie... Please wait.");
    setLoading(true);
    try {
      await cryptoZombies.methods.createRandomZombie(name).send({ from: account, gas: 3000000 })
        .on("transactionHash", (hash) => console.log("Tx Hash:", hash))
        .on("receipt", () => {
          setTxStatus(`Zombie ${name} created!`);
          getZombiesByOwner(account);
        })
        .on("error", (error) => setTxStatus("Error creating zombie: " + error.message));
    } catch (error) {
      setTxStatus("Error creating zombie: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const feedOnKitty = async (zombieId, kittyId) => {
    if (!cryptoZombies) return;
    setTxStatus("Zombie is eating... Please wait.");
    setLoading(true);
    try {
      await cryptoZombies.methods.feedOnKitty(zombieId, kittyId).send({ from: account, gas: 3000000 })
        .on("receipt", () => {
          setTxStatus("Zombie has fed successfully!");
          getZombiesByOwner(account);
        });
    } catch (error) {
      setTxStatus("Error feeding zombie: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const levelUp = async (zombieId) => {
    if (!cryptoZombies) return;
    setTxStatus("Leveling up... Please wait.");
    setLoading(true);
    try {
      await cryptoZombies.methods.levelUp(zombieId).send({ from: account, value: web3.utils.toWei("0.001", "ether"), gas: 3000000 })
        .on("receipt", () => {
          setTxStatus("Zombie leveled up!");
          getZombiesByOwner(account);
        });
    } catch (error) {
      setTxStatus("Error leveling up: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getZombieImage = (dna) => `https://robohash.org/${dna}.png?set=set2`;

  return (
    <div className="container spooky-background">
      {txStatus && <div className="alert alert-info">{txStatus}</div>}
      {loading && <Spinner animation="border" variant="light" className="loading-spinner" />}
      <div className="row">
        {zombies.map((zombie, index) => (
          <div className="col-md-4 zombie-card" key={index}>
            <div className="card spooky-card" onClick={() => { setSelectedZombie(zombie); setShowModal(true); }}>
              <img src={getZombieImage(zombie.dna + zombie.level)} className="card-img-top" alt="Zombie" />
              <div className="card-body">
                <h5 className="card-title">{zombie.name}</h5>
                <p className="card-text">Level: {zombie.level}</p>
                <button className="btn btn-warning level-up spooky-button" onClick={(e) => { e.stopPropagation(); levelUp(zombie.id); }}>
                  Level Up
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="btn-group spooky-buttons">
        <Button variant="primary show-zombies spooky-button" onClick={() => getZombiesByOwner(account)}>Show Zombies</Button>
        <Button variant="success create-zombie spooky-button" onClick={() => createRandomZombie("Zombie" + Math.floor(Math.random() * 1000))}>
          Create Zombie
        </Button>
        <Button variant="warning feed-on-kitty spooky-button" onClick={() => feedOnKitty(1, 1)}>Feed on Kitty</Button>
      </div>

      

{/* Show details only when a zombie is selected */}
{selectedZombie && (
  <div className="zombie-details-container">
    <div className="zombie-details-popup">
      <div className="popup-header">
        <h5>🧟‍♂️ {selectedZombie.name}</h5>
        <button className="close-btn" onClick={() => setSelectedZombie(null)}>X</button>
      </div>
      <p><strong>DNA:</strong> {selectedZombie.dna}</p>
      <p><strong>Level:</strong> {selectedZombie.level}</p>
      <p><strong>Wins:</strong> {selectedZombie.winCount}</p>
      <p><strong>Losses:</strong> {selectedZombie.lossCount}</p>
    </div>
  </div>
)}


    </div>
  );
};

export default ZombieApp;
