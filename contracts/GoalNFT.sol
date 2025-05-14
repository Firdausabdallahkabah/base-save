// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title GoalNFT
 * @dev NFT rewards for completing savings goals on BaseSave
 */
contract GoalNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    // Counter for token IDs
    Counters.Counter private _tokenIdCounter;

    // Address of the GoalTracker contract
    address public goalTracker;

    // Base URI for metadata
    string public baseImageURI;

    // Mapping from token ID to goal ID
    mapping(uint256 => uint256) public tokenToGoalId;

    // Mapping from token ID to token URI
    mapping(uint256 => string) private _tokenURIs;

    // Events
    event RewardMinted(address indexed recipient, uint256 indexed tokenId, uint256 indexed goalId);
    event GoalTrackerUpdated(address indexed newGoalTracker);
    event BaseImageURIUpdated(string newBaseImageURI);

    /**
     * @dev Constructor
     * @param _baseImageURI Base URI for NFT images
     */
    constructor(string memory _baseImageURI) ERC721("BaseSave Goal Achievement", "GOAL") {
        baseImageURI = _baseImageURI;
        transferOwnership(msg.sender);
    }

    /**
     * @dev Set the GoalTracker contract address
     * @param _goalTracker Address of the GoalTracker contract
     */
    function setGoalTracker(address _goalTracker) external onlyOwner {
        require(_goalTracker != address(0), "GoalTracker cannot be zero address");
        goalTracker = _goalTracker;
        emit GoalTrackerUpdated(_goalTracker);
    }

    /**
     * @dev Set the base image URI
     * @param _baseImageURI New base URI for NFT images
     */
    function setBaseImageURI(string memory _baseImageURI) external onlyOwner {
        baseImageURI = _baseImageURI;
        emit BaseImageURIUpdated(_baseImageURI);
    }

    /**
     * @dev Mint a reward NFT for completing a goal
     * @param _recipient Address of the recipient
     * @param _goalId ID of the completed goal
     * @param _goalTitle Title of the completed goal
     * @return tokenId The ID of the minted NFT
     */
    function mintReward(address _recipient, uint256 _goalId, string memory _goalTitle) external returns (uint256) {
        require(msg.sender == goalTracker, "Only GoalTracker can mint rewards");
        require(_recipient != address(0), "Recipient cannot be zero address");

        // Generate new token ID
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        // Mint NFT
        _safeMint(_recipient, tokenId);

        // Store goal ID
        tokenToGoalId[tokenId] = _goalId;

        // Generate and set token URI
        string memory uri = generateTokenURI(tokenId, _goalId, _goalTitle);
        _tokenURIs[tokenId] = uri;

        emit RewardMinted(_recipient, tokenId, _goalId);

        return tokenId;
    }

    /**
     * @dev Generate token URI with on-chain metadata
     * @param _tokenId ID of the token
     * @param _goalId ID of the completed goal
     * @param _goalTitle Title of the completed goal
     * @return Token URI with embedded metadata
     */
    function generateTokenURI(uint256 _tokenId, uint256 _goalId, string memory _goalTitle) internal view returns (string memory) {
        // Create JSON metadata
        bytes memory metadata = abi.encodePacked(
            '{',
            '"name": "Goal Achievement: ', _goalTitle, '",',
            '"description": "This NFT represents the successful completion of a savings goal on BaseSave.",',
            '"image": "', baseImageURI, _tokenId.toString(), '.png",',
            '"attributes": [',
            '{"trait_type": "Goal ID", "value": "', _goalId.toString(), '"},',
            '{"trait_type": "Achievement Date", "value": "', block.timestamp.toString(), '"},',
            '{"trait_type": "Platform", "value": "BaseSave"}',
            ']',
            '}'
        );

        // Encode as base64
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(metadata)
            )
        );
    }

    /**
     * @dev Get all tokens owned by an address
     * @param _owner Address to query
     * @return Array of token IDs
     */
    function getTokensByOwner(address _owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }

        return tokenIds;
    }

    // The following functions are overrides required by Solidity

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }
}
