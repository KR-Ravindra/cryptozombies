// import React, { useState, useEffect } from 'react';
// import Web3 from 'web3';
// import cryptoZombiesABI from './cryptozombies_abi.js';
// import './ZombieApp.css';

// const ZombieApp = () => {
//   const [web3, setWeb3] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [cryptoZombies, setCryptoZombies] = useState(null);
//   const [zombies, setZombies] = useState([]);
//   const [txStatus, setTxStatus] = useState('');

//   useEffect(() => {
//     const initWeb3 = async () => {
//       if (window.ethereum) {
//         const web3 = new Web3(window.ethereum);
//         try {
//           await window.ethereum.request({ method: 'eth_requestAccounts' });
//           const accounts = await web3.eth.getAccounts();
//           setWeb3(web3);
//           setAccount(accounts[0]);
//           const cryptoZombiesAddress = "0xFd2F74eaC86c7E4DcD3C17E286ca514fdE732bF6"; // Replace with your deployed contract address
//           const cryptoZombies = new web3.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);
//           setCryptoZombies(cryptoZombies);
//           console.log("Contract instance initialized:", cryptoZombies);
//         } catch (error) {
//           console.error("User denied account access or other error:", error);
//         }
//       } else if (window.web3) {
//         const web3 = new Web3(window.web3.currentProvider);
//         const accounts = await web3.eth.getAccounts();
//         setWeb3(web3);
//         setAccount(accounts[0]);
//         const cryptoZombiesAddress = "0xFd2F74eaC86c7E4DcD3C17E286ca514fdE732bF6"; // Replace with your deployed contract address
//         const cryptoZombies = new web3.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);
//         setCryptoZombies(cryptoZombies);
//         console.log("Contract instance initialized:", cryptoZombies);
//       } else {
//         console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
//       }
//     };

//     initWeb3();
//   }, []);



//   const getZombiesByOwner = async (owner) => {
//     if (!cryptoZombies) {
//       console.error("Contract instance not initialized");
//       return;
//     }
//     try {
//       console.log("Fetching zombies for owner:", owner);
//       const ids = await cryptoZombies.methods.getZombiesByOwner(owner).call();
//       console.log("Zombie IDs fetched:", ids);
//       const zombieDetails = await Promise.all(ids.map(async (id) => {
//         const zombie = await cryptoZombies.methods.zombies(id).call();
//         return { id: id.toString(), ...zombie };
//       }));
//       console.log("Zombie details fetched:", zombieDetails);
//       setZombies(zombieDetails);
//     } catch (error) {
//       console.error("Error fetching zombies:", error);
//       setTxStatus("Error fetching zombies: " + error.message);
//     }
//   };

//   const createRandomZombie = async (name) => {
//     if (!cryptoZombies) {
//       console.error("Contract instance not initialized");
//       return;
//     }
//     setTxStatus("Creating new zombie on the blockchain. This may take a while...");
//     try {
//       console.log("Account:", account);
//       await cryptoZombies.methods.createRandomZombie(name).send({ from: account, gas: 3000000 })
//         .on('transactionHash', function(hash){
//           console.log("Transaction hash:", hash);
//         })
//         .on('receipt', function(receipt){
//           console.log("Transaction receipt:", receipt);
//           setTxStatus("Successfully created " + name + "!");
//           getZombiesByOwner(account);
//         })
//         .on('error', function(error, receipt) {
//           console.error("Error creating zombie:", error);
//           console.error("Transaction receipt:", receipt);
//           setTxStatus("Error creating zombie: " + error.message);
//         });
//     } catch (error) {
//       console.error("Error creating zombie:", error);
//       setTxStatus("Error creating zombie: " + error.message);
//     }
//   };

//   const feedOnKitty = async (zombieId, kittyId) => {
//     if (!cryptoZombies) {
//       console.error("Contract instance not initialized");
//       return;
//     }
//     setTxStatus("Eating a kitty. This may take a while...");
//     try {
//       console.log("Feeding zombie with ID:", zombieId, "on kitty with ID:", kittyId);
//       await cryptoZombies.methods.feedOnKitty(zombieId, kittyId).send({ from: account, gas: 3000000 })
//         .on('transactionHash', function(hash){
//           console.log("Transaction hash:", hash);
//         })
//         .on('receipt', function(receipt){
//           console.log("Transaction receipt:", receipt);
//           setTxStatus("Ate a kitty and spawned a new Zombie!");
//           getZombiesByOwner(account);
//         })
//         .on('error', function(error, receipt) {
//           console.error("Error feeding on kitty:", error);
//           console.error("Transaction receipt:", receipt);
//           setTxStatus("Error feeding on kitty: " + error.message);
//         });
//     } catch (error) {
//       console.error("Error feeding on kitty:", error);
//       setTxStatus("Error feeding on kitty: " + error.message);
//     }
//   };

//   const levelUp = async (zombieId) => {
//     if (!cryptoZombies) {
//       console.error("Contract instance not initialized");
//       return;
//     }
//     if (!zombieId) {
//       console.error("Invalid zombie ID:", zombieId);
//       setTxStatus("Invalid zombie ID");
//       return;
//     }
//     setTxStatus("Leveling up your zombie...");
//     try {
//       console.log("Leveling up zombie with ID:", zombieId);
//       await cryptoZombies.methods.levelUp(zombieId).send({ from: account, value: web3.utils.toWei("0.001", "ether"), gas: 3000000 })
//         .on('transactionHash', function(hash){
//           console.log("Transaction hash:", hash);
//         })
//         .on('receipt', function(receipt){
//           console.log("Transaction receipt:", receipt);
//           setTxStatus("Power overwhelming! Zombie successfully leveled up");
//           getZombiesByOwner(account);
//         })
//         .on('error', function(error, receipt) {
//           console.error("Error leveling up zombie:", error);
//           console.error("Transaction receipt:", receipt);
//           setTxStatus("Error leveling up zombie: " + error.message);
//         });
//     } catch (error) {
//       console.error("Error leveling up zombie:", error);
//       setTxStatus("Error leveling up zombie: " + error.message);
//     }
//   };

//   const displayZombies = (zombieDetails) => {
//     setZombies(zombieDetails);
//   };

//   return (
//     <div className="container spooky-background">
//       <div className="alert alert-info" role="alert">{txStatus}</div>
//       <div className="row">
//         {zombies.map((zombie, index) => (
//           <div className="col-md-4 zombie-card" key={index}>
//             <div className="card">
//               <div className="card-body">
//                 <h5 className="card-title">Name: {zombie.name}</h5>
//                 <p className="card-text">DNA: {zombie.dna}</p>
//                 <p className="card-text">Level: {zombie.level}</p>
//                 <p className="card-text">Wins: {zombie.winCount}</p>
//                 <p className="card-text">Losses: {zombie.lossCount}</p>
//                 <p className="card-text">Ready Time: {zombie.readyTime}</p>
//                 <button className="btn btn-warning" onClick={() => levelUp(zombie.id)}>Level Up</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="btn-group spooky-buttons" role="group" aria-label="Zombie Actions">
//         <button className="btn btn-primary spooky-button" onClick={() => getZombiesByOwner(account)}>Show Zombies</button>
//         <button className="btn btn-success spooky-button" onClick={() => createRandomZombie("Zombie" + Math.floor(Math.random() * 1000))}>Create Zombie</button>
//         <button className="btn btn-warning spooky-button" onClick={() => feedOnKitty(1, 1)}>Feed on Kitty</button> {/* Example IDs */}
//       </div>
//     </div>
//   );
// };

// export default ZombieApp;
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Modal, Button, Spinner } from "react-bootstrap";
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
          const contractAddress = "0xFd2F74eaC86c7E4DcD3C17E286ca514fdE732bF6"; // Update if needed
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

      {/* <div className="zombie-container">
  {zombies.map((zombie, index) => (
    <div key={index} className="zombie-wrapper">
      
      <img
        src={getZombieImage(zombie.dna)}
        className={`zombie-image ${selectedZombie?.id === zombie.id ? 'zombie-move-left' : ''}`}
        alt="Zombie"
        onClick={() => setSelectedZombie(zombie)}
      />
    </div>
  ))}
</div> */}
      <div className="row">
        {zombies.map((zombie, index) => (
          <div className="col-md-4 zombie-card" key={index}>
            <div className="card spooky-card" onClick={() => { setSelectedZombie(zombie); setShowModal(true); }}>
              <img src={getZombieImage(zombie.dna)} className="card-img-top" alt="Zombie" />
              {/* <img
        src={getZombieImage(zombie.dna)}
        className={`zombie-image ${selectedZombie?.id === zombie.id ? 'zombie-move-left' : 'card-img-top'}`}
        alt="Zombie"
        onClick={() => setSelectedZombie(zombie)}
      /> */}
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
