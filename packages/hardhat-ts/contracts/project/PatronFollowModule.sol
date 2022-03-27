pragma solidity 0.8.10;
//SPDX-License-Identifier: MIT

import { console } from "hardhat/console.sol";
import { IFollowModule } from "../interfaces/IFollowModule.sol";
import { ModuleBase } from "../core/modules/ModuleBase.sol";
import { Errors } from "../libraries/Errors.sol";
import { Events } from "../libraries/Events.sol";
import { FeeModuleBase } from "../core/modules/FeeModuleBase.sol";
import { FollowValidatorFollowModuleBase } from "../core/modules/follow/FollowValidatorFollowModuleBase.sol";

import { ILensHub } from "../interfaces/ILensHub.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

library PatronFollowErrors {
  error TransferNotAllowed();
  error NotImplemented();
  error InvalidCurrency();
  error InvalidFollowerForProfile();
  error SubscriptionPaymentAmountNotValid();
  error SubscriptionExpired();
  error SubscriptionInvalid();
}

// test profile address: 0xb212a727DD414c9cc309F7C663c5753D170AFF28

contract PatronFollowModule is IFollowModule, ModuleBase {
  string public purpose = "Patron Follower Module for Lens Protocol";
  address immutable POLYGON_DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
  using SafeERC20 for IERC20;

  struct MembershipLevel {
    uint32 id;
    string name;
    string dataUrl;
    uint256 minAmount;
  }

  struct FollowerData {
    address followerAddress;
    uint256 lastPaymentAmount;
    uint256 lastPaymentTimestamp;
  }

  struct ProfileData {
    uint256 profileId;
    address profileAddress;
    mapping(uint32 => MembershipLevel) membershipLevels;
    mapping(address => FollowerData) followers;
    uint256 miniumSubscriptionAmount;
  }

  mapping(uint256 => ProfileData) public _profiles;

  struct PaymentHistory {
    uint256 timestamp;
    uint256 amount;
  }

  struct ProfileDataExtra {
    uint256 profileAddress;
    PaymentHistory[] paymentHistory;
  }
  mapping(uint256 => ProfileDataExtra) public _profilesExtra;

  constructor(address hub) ModuleBase(hub) {
    // what should we do on deploy?j
  }

  /********* Assert ************/

  function assertProfileOwner(uint256 profileId) internal view {
    address owner = IERC721(HUB).ownerOf(profileId);
    if (msg.sender != owner) revert Errors.NotProfileOwner();
  }

  function assertSubscriptionValid(uint256 profileId, address followerAddress) public view {
    if (_profiles[profileId].miniumSubscriptionAmount > _profiles[profileId].followers[followerAddress].lastPaymentAmount) {
      // check that follower has paid enough
      revert PatronFollowErrors.SubscriptionInvalid();
    }
    if (isFollowerActive(profileId, followerAddress)) {
      revert PatronFollowErrors.SubscriptionExpired();
    }
  }

  /********** Helpers ********** */
  function isFollowerActive(uint256 profileId, address followerAddress) public view returns (bool) {
    bool result = block.timestamp - _profiles[profileId].followers[followerAddress].lastPaymentTimestamp <= 32 days;
    return result;
  }

  /********** Patron Functions *****/

  /**
   * @notice Set or update a membership level for a profile
   */
  function setMemberships(
    uint256 profileId,
    uint32 id,
    string calldata name,
    string calldata dataUrl,
    uint256 amount
  ) external {
    assertProfileOwner(profileId);
    _profiles[profileId].membershipLevels[id] = MembershipLevel({ id: id, name: name, dataUrl: dataUrl, minAmount: amount });
  }

  /**
   * @notice Process payment for a profile from a follower
   */
  function processPayment(
    uint256 profileId,
    address followerAddress,
    uint256 amount
  ) public {
    FollowerData memory follow = _profiles[profileId].followers[followerAddress];
    if (follow.followerAddress == address(0)) {
      revert PatronFollowErrors.InvalidFollowerForProfile();
    } else if (amount < _profiles[profileId].miniumSubscriptionAmount) {
      revert PatronFollowErrors.SubscriptionPaymentAmountNotValid();
    }

    address recipient = _profiles[profileId].profileAddress;
    IERC20(POLYGON_DAI).safeTransferFrom(followerAddress, recipient, amount);
    (followerAddress, recipient, amount);

    follow.lastPaymentAmount = amount;
    follow.lastPaymentTimestamp = block.timestamp;

    _profilesExtra[profileId].paymentHistory.push(PaymentHistory({ timestamp: follow.lastPaymentTimestamp, amount: follow.lastPaymentAmount }));

    _profiles[profileId].followers[followerAddress] = follow;
  }

  /********** Lens Protocol Primitives ***********/

  function initializeFollowModule(uint256 profileId, bytes calldata data) external override onlyHub returns (bytes memory) {
    console.log('hi!');
    address owner = IERC721(HUB).ownerOf(profileId);
    _profiles[profileId].profileId = profileId;
    _profiles[profileId].profileAddress = owner;
    console.log('[initializeFollowModule] profileId:%d', profileId);
    console.log('_profile: %d', _profiles[profileId].profileId);
  }

  function processFollow(
    address followerAddress,
    uint256 profileId,
    bytes calldata data
  ) external override {
    (address currencyAddress, uint256 amount) = abi.decode(data, (address, uint256));
    if (currencyAddress != POLYGON_DAI) revert PatronFollowErrors.InvalidCurrency();

    if (_profiles[profileId].followers[followerAddress].followerAddress == address(0)) {
      _profiles[profileId].followers[followerAddress];
    }
    processPayment(profileId, followerAddress, amount);
  }

  /**
   * @notice Standard function to validate follow NFT ownership. This module is agnostic to follow NFT token IDs
   * and other properties.
   */
  function validateFollow(
    uint256 profileId,
    address followerAddress,
    uint256 followNFTTokenId
  ) external view override {
    address followNFT = ILensHub(HUB).getFollowNFT(profileId);
    if (followNFT == address(0)) revert Errors.FollowInvalid();
    if (followNFTTokenId == 0) {
      // check that follower owns a followNFT
      if (IERC721(followNFT).balanceOf(followerAddress) == 0) revert Errors.FollowInvalid();
    } else {
      // check that follower owns the specific followNFT
      if (IERC721(followNFT).ownerOf(followNFTTokenId) != followerAddress) revert Errors.FollowInvalid();
    }

    assertSubscriptionValid(profileId, followerAddress);
  }

  function followModuleTransferHook(
    uint256 profileId,
    address from,
    address to,
    uint256 followNFTTokenId
  ) external override {
    revert PatronFollowErrors.TransferNotAllowed();
  }

  //   /**
  //    * @notice A custom function that allows profile owners to customize approved addresses.
  //    *
  //    * @param profileId The profile ID to approve/disapprove follower addresses for.
  //    * @param addresses The addresses to approve/disapprove for following the profile.
  //    * @param toApprove Whether to approve or disapprove the addresses for following the profile.
  //    */
  //   function approve(
  //     uint256 profileId,
  //     address[] calldata addresses,
  //     bool[] calldata toApprove
  //   ) external {
  //     if (addresses.length != toApprove.length) revert Errors.InitParamsInvalid();
  //     address owner = IERC721(HUB).ownerOf(profileId);
  //     if (msg.sender != owner) revert Errors.NotProfileOwner();

  //     for (uint256 i = 0; i < addresses.length; ++i) {
  //       _approvedByProfileByOwner[owner][profileId][addresses[i]] = toApprove[i];
  //     }

  //     emit Events.FollowsApproved(owner, profileId, addresses, toApprove, block.timestamp);
  //   }
}
