// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SimpleGoalNFT.sol";

/**
 * @title SimpleGoalTracker
 * @dev Simplified contract for testing deployment
 */
contract SimpleGoalTracker is Ownable {
    // Address of the GoalNFT contract
    SimpleGoalNFT public goalNFT;
    
    // Address where fees are collected
    address public feeCollector;
    
    // Event for goal creation
    event GoalCreated(uint256 indexed goalId, address indexed owner);
    
    /**
     * @dev Constructor
     * @param _feeCollector Address where fees will be sent
     * @param _goalNFT Address of the GoalNFT contract
     */
    constructor(address _feeCollector, address _goalNFT) {
        feeCollector = _feeCollector;
        goalNFT = SimpleGoalNFT(_goalNFT);
        transferOwnership(msg.sender);
    }
    
    /**
     * @dev Create a new goal (simplified)
     * @return goalId The ID of the newly created goal
     */
    function createGoal() external returns (uint256 goalId) {
        goalId = 1; // Simplified for testing
        emit GoalCreated(goalId, msg.sender);
        return goalId;
    }
}
