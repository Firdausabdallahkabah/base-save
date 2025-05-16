// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleGoalNFT
 * @dev Simplified NFT contract for testing deployment
 */
contract SimpleGoalNFT is ERC721, Ownable {
    // Address of the GoalTracker contract
    address public goalTracker;
    
    // Base URI for metadata
    string public baseImageURI;
    
    /**
     * @dev Constructor
     * @param _baseImageURI Base URI for NFT images
     */
    constructor(string memory _baseImageURI) ERC721("BaseSave Goal", "GOAL") {
        baseImageURI = _baseImageURI;
        transferOwnership(msg.sender);
    }
    
    /**
     * @dev Set the GoalTracker contract address
     * @param _goalTracker Address of the GoalTracker contract
     */
    function setGoalTracker(address _goalTracker) external onlyOwner {
        goalTracker = _goalTracker;
    }
    
    /**
     * @dev Mint a reward NFT
     * @param _recipient Address of the recipient
     * @param _tokenId Token ID to mint
     */
    function mintReward(address _recipient, uint256 _tokenId) external {
        require(msg.sender == goalTracker || msg.sender == owner(), "Not authorized");
        _mint(_recipient, _tokenId);
    }
}
