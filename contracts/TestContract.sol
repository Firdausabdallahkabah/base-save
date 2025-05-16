// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TestContract
 * @dev Extremely simple contract for testing deployment
 */
contract TestContract {
    string public message;
    
    /**
     * @dev Constructor
     * @param _message A simple message
     */
    constructor(string memory _message) {
        message = _message;
    }
    
    /**
     * @dev Update the message
     * @param _newMessage The new message
     */
    function updateMessage(string memory _newMessage) external {
        message = _newMessage;
    }
}
