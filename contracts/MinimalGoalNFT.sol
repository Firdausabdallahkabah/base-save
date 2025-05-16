// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title MinimalGoalNFT
 * @dev Extremely minimal NFT contract for testing deployment
 */
contract MinimalGoalNFT is ERC721 {
    constructor() ERC721("BaseSave Goal", "GOAL") {}
}
