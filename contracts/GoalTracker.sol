// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./GoalNFT.sol";

/**
 * @title GoalTracker
 * @dev A contract for creating and managing savings goals on Base
 */
contract GoalTracker is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    // Counter for goal IDs
    Counters.Counter private _goalIdCounter;

    // Address of the GoalNFT contract
    GoalNFT public goalNFT;

    // Protocol fee percentage (in basis points, e.g., 50 = 0.5%)
    uint256 public protocolFeeRate = 50; // 0.5% default

    // Address where protocol fees are collected
    address public feeCollector;

    // Minimum goal duration in seconds (default: 1 day)
    uint256 public minGoalDuration = 1 days;

    // Maximum goal duration in seconds (default: 5 years)
    uint256 public maxGoalDuration = 1825 days; // 5 years

    // Goal status enum
    enum GoalStatus { Active, Completed, Expired, Withdrawn }

    // Goal struct
    struct Goal {
        uint256 id;
        address owner;
        string title;
        string description;
        address tokenAddress; // ETH = address(0)
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 createdAt;
        uint256 deadline;
        bool isPublic;
        GoalStatus status;
    }

    // Mapping from goal ID to Goal
    mapping(uint256 => Goal) public goals;

    // Mapping from user address to their goal IDs
    mapping(address => uint256[]) public userGoals;

    // Events
    event GoalCreated(uint256 indexed goalId, address indexed owner, string title, uint256 targetAmount, uint256 deadline);
    event Deposit(uint256 indexed goalId, address indexed depositor, uint256 amount);
    event GoalCompleted(uint256 indexed goalId, address indexed owner, uint256 amount);
    event GoalWithdrawn(uint256 indexed goalId, address indexed owner, uint256 amount, bool completed);
    event GoalExpired(uint256 indexed goalId, address indexed owner);
    event ProtocolFeeUpdated(uint256 newFeeRate);
    event FeeCollectorUpdated(address newFeeCollector);

    /**
     * @dev Constructor
     * @param _feeCollector Address where protocol fees will be sent
     * @param _goalNFT Address of the GoalNFT contract
     */
    constructor(address _feeCollector, address _goalNFT) {
        require(_feeCollector != address(0), "Fee collector cannot be zero address");
        feeCollector = _feeCollector;
        goalNFT = GoalNFT(_goalNFT);
        transferOwnership(msg.sender);
    }

    /**
     * @dev Create a new savings goal
     * @param _title Goal title
     * @param _description Goal description
     * @param _tokenAddress Address of the token to save (address(0) for ETH)
     * @param _targetAmount Target amount to save
     * @param _deadline Deadline timestamp for the goal
     * @param _isPublic Whether the goal is public or private
     * @return goalId The ID of the newly created goal
     */
    function createGoal(
        string memory _title,
        string memory _description,
        address _tokenAddress,
        uint256 _targetAmount,
        uint256 _deadline,
        bool _isPublic
    ) external returns (uint256 goalId) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_deadline - block.timestamp >= minGoalDuration, "Goal duration too short");
        require(_deadline - block.timestamp <= maxGoalDuration, "Goal duration too long");

        // Generate new goal ID
        _goalIdCounter.increment();
        goalId = _goalIdCounter.current();

        // Create new goal
        Goal storage newGoal = goals[goalId];
        newGoal.id = goalId;
        newGoal.owner = msg.sender;
        newGoal.title = _title;
        newGoal.description = _description;
        newGoal.tokenAddress = _tokenAddress;
        newGoal.targetAmount = _targetAmount;
        newGoal.currentAmount = 0;
        newGoal.createdAt = block.timestamp;
        newGoal.deadline = _deadline;
        newGoal.isPublic = _isPublic;
        newGoal.status = GoalStatus.Active;

        // Add goal to user's goals
        userGoals[msg.sender].push(goalId);

        emit GoalCreated(goalId, msg.sender, _title, _targetAmount, _deadline);

        return goalId;
    }

    /**
     * @dev Deposit funds to a goal
     * @param _goalId ID of the goal to deposit to
     * @param _amount Amount to deposit
     */
    function deposit(uint256 _goalId, uint256 _amount) external payable nonReentrant {
        Goal storage goal = goals[_goalId];

        require(goal.id != 0, "Goal does not exist");
        require(goal.status == GoalStatus.Active, "Goal is not active");
        require(block.timestamp < goal.deadline, "Goal has expired");

        // Handle ETH deposits
        if (goal.tokenAddress == address(0)) {
            require(msg.value == _amount, "Sent ETH amount does not match specified amount");
            goal.currentAmount += msg.value;
        }
        // Handle ERC20 token deposits
        else {
            require(msg.value == 0, "ETH sent with ERC20 deposit");
            IERC20 token = IERC20(goal.tokenAddress);
            uint256 balanceBefore = token.balanceOf(address(this));
            token.safeTransferFrom(msg.sender, address(this), _amount);
            uint256 balanceAfter = token.balanceOf(address(this));
            uint256 actualDeposit = balanceAfter - balanceBefore;
            goal.currentAmount += actualDeposit;
        }

        // Check if goal is completed
        if (goal.currentAmount >= goal.targetAmount) {
            goal.status = GoalStatus.Completed;

            // Mint NFT reward
            goalNFT.mintReward(goal.owner, goal.id, goal.title);

            emit GoalCompleted(_goalId, goal.owner, goal.currentAmount);
        }

        emit Deposit(_goalId, msg.sender, _amount);
    }

    /**
     * @dev Withdraw funds from a goal
     * @param _goalId ID of the goal to withdraw from
     */
    function withdraw(uint256 _goalId) external nonReentrant {
        Goal storage goal = goals[_goalId];

        require(goal.id != 0, "Goal does not exist");
        require(goal.owner == msg.sender, "Only goal owner can withdraw");
        require(goal.status == GoalStatus.Active || goal.status == GoalStatus.Completed || goal.status == GoalStatus.Expired,
                "Goal already withdrawn");

        bool isCompleted = goal.status == GoalStatus.Completed ||
                          (goal.currentAmount >= goal.targetAmount);

        // If goal is not completed and not expired, apply early withdrawal penalty
        if (!isCompleted && block.timestamp < goal.deadline) {
            revert("Cannot withdraw before deadline unless goal is completed");
        }

        // Mark goal as expired if deadline has passed
        if (block.timestamp >= goal.deadline && goal.status == GoalStatus.Active) {
            goal.status = GoalStatus.Expired;
            emit GoalExpired(_goalId, goal.owner);
        }

        // Calculate protocol fee
        uint256 protocolFee = (goal.currentAmount * protocolFeeRate) / 10000;
        uint256 withdrawAmount = goal.currentAmount - protocolFee;

        // Update goal status
        goal.status = GoalStatus.Withdrawn;

        // Transfer funds
        if (goal.tokenAddress == address(0)) {
            // Send protocol fee
            if (protocolFee > 0) {
                (bool feeSuccess, ) = payable(feeCollector).call{value: protocolFee}("");
                require(feeSuccess, "Fee transfer failed");
            }

            // Send remaining amount to user
            (bool success, ) = payable(msg.sender).call{value: withdrawAmount}("");
            require(success, "Transfer failed");
        } else {
            IERC20 token = IERC20(goal.tokenAddress);

            // Send protocol fee
            if (protocolFee > 0) {
                token.safeTransfer(feeCollector, protocolFee);
            }

            // Send remaining amount to user
            token.safeTransfer(msg.sender, withdrawAmount);
        }

        emit GoalWithdrawn(_goalId, msg.sender, withdrawAmount, isCompleted);
    }

    /**
     * @dev Get all goals for a user
     * @param _user Address of the user
     * @return Array of goal IDs
     */
    function getGoalsByUser(address _user) external view returns (uint256[] memory) {
        return userGoals[_user];
    }

    /**
     * @dev Get details for a specific goal
     * @param _goalId ID of the goal
     * @return Goal details
     */
    function getGoalDetails(uint256 _goalId) external view returns (Goal memory) {
        require(goals[_goalId].id != 0, "Goal does not exist");

        Goal memory goal = goals[_goalId];

        // Only allow owner to view private goals
        if (!goal.isPublic && goal.owner != msg.sender) {
            revert("Not authorized to view this goal");
        }

        return goal;
    }

    /**
     * @dev Get all public goals (with pagination)
     * @param _offset Starting index
     * @param _limit Maximum number of goals to return
     * @return Array of goals
     */
    function getPublicGoals(uint256 _offset, uint256 _limit) external view returns (Goal[] memory) {
        uint256 totalGoals = _goalIdCounter.current();

        // Adjust limit if it exceeds the number of goals
        if (_offset >= totalGoals) {
            return new Goal[](0);
        }

        uint256 remaining = totalGoals - _offset;
        uint256 count = remaining < _limit ? remaining : _limit;

        Goal[] memory publicGoals = new Goal[](count);
        uint256 currentIndex = 0;

        for (uint256 i = _offset + 1; i <= totalGoals && currentIndex < count; i++) {
            if (goals[i].isPublic) {
                publicGoals[currentIndex] = goals[i];
                currentIndex++;
            }
        }

        // Resize array if we found fewer public goals than expected
        if (currentIndex < count) {
            assembly {
                mstore(publicGoals, currentIndex)
            }
        }

        return publicGoals;
    }

    /**
     * @dev Update protocol fee rate (owner only)
     * @param _newFeeRate New fee rate in basis points (e.g., 50 = 0.5%)
     */
    function updateProtocolFeeRate(uint256 _newFeeRate) external onlyOwner {
        require(_newFeeRate <= 500, "Fee cannot exceed 5%");
        protocolFeeRate = _newFeeRate;
        emit ProtocolFeeUpdated(_newFeeRate);
    }

    /**
     * @dev Update fee collector address (owner only)
     * @param _newFeeCollector New fee collector address
     */
    function updateFeeCollector(address _newFeeCollector) external onlyOwner {
        require(_newFeeCollector != address(0), "Fee collector cannot be zero address");
        feeCollector = _newFeeCollector;
        emit FeeCollectorUpdated(_newFeeCollector);
    }

    /**
     * @dev Update goal NFT contract address (owner only)
     * @param _newGoalNFT New GoalNFT contract address
     */
    function updateGoalNFT(address _newGoalNFT) external onlyOwner {
        require(_newGoalNFT != address(0), "GoalNFT cannot be zero address");
        goalNFT = GoalNFT(_newGoalNFT);
    }

    /**
     * @dev Update minimum and maximum goal durations (owner only)
     * @param _minDuration Minimum duration in seconds
     * @param _maxDuration Maximum duration in seconds
     */
    function updateGoalDurationLimits(uint256 _minDuration, uint256 _maxDuration) external onlyOwner {
        require(_minDuration <= _maxDuration, "Min duration must be <= max duration");
        minGoalDuration = _minDuration;
        maxGoalDuration = _maxDuration;
    }

    /**
     * @dev Receive function to handle direct ETH transfers
     */
    receive() external payable {
        // Funds are accepted but not assigned to any goal
        // They can be withdrawn by the contract owner
    }

    /**
     * @dev Withdraw any excess ETH in the contract (owner only)
     * @param _amount Amount to withdraw
     */
    function withdrawExcessETH(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Withdraw any excess ERC20 tokens in the contract (owner only)
     * @param _token Token address
     * @param _amount Amount to withdraw
     */
    function withdrawExcessTokens(address _token, uint256 _amount) external onlyOwner {
        IERC20 token = IERC20(_token);
        require(_amount <= token.balanceOf(address(this)), "Insufficient balance");
        token.safeTransfer(msg.sender, _amount);
    }
}
