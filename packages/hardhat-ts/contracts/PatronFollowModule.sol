pragma solidity 0.8.10;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import { IFollowModule } from "./lens-protocol/interfaces/IFollowModule.sol";
import { ModuleBase } from "./lens-protocol/core/modules/ModuleBase.sol";
import { Errors } from "./lens-protocol/libraries/Errors.sol";
import { Events } from "./lens-protocol/libraries/Events.sol";
import { FeeModuleBase } from "./lens-protocol/core/modules/FeeModuleBase.sol";
import { FollowValidatorFollowModuleBase } from "./lens-protocol/core/modules/follow/FollowValidatorFollowModuleBase.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

library PatronFollowErrors {
  error TransferNotAllowed();
  error NotImplemented();
}

// test profile address: 0xb212a727DD414c9cc309F7C663c5753D170AFF28

contract PatronFollowModule is IFollowModule, FollowValidatorFollowModuleBase {
  string public purpose = "Patron Follower Module for Lens Protocol";

  struct Membership {
    uint32 id;
    string name;
    string dataUrl;
    uint256 amount;
  }

  struct FollowerData {
    address followerAddress;
    uint256 amount;
  }

  struct Profile {
    uint256 profileId;
    address profileAddress;
    mapping(uint32 => Membership) memberships;
    mapping(address => FollowerData) followers;
  }

  mapping(uint256 => Profile) public _profiles;

  constructor(address hub) ModuleBase(hub) {
    // what should we do on deploy?j
  }

  function assertProfileOwner(uint256 profileId) internal {
    address owner = IERC721(HUB).ownerOf(profileId);
    if (msg.sender != owner) revert Errors.NotProfileOwner();
  }

  function initializeFollowModule(uint256 profileId, bytes calldata data) external override onlyHub returns (bytes memory) {
    address owner = IERC721(HUB).ownerOf(profileId);
    _profiles[profileId].profileId = profileId;
    _profiles[profileId].profileAddress = owner;
  }

  function setMemberships(
    uint256 profileId,
    uint32 id,
    string calldata name,
    string calldata dataUrl,
    uint256 amount
  ) external {
    assertProfileOwner(profileId);
    _profiles[profileId].memberships[id] = Membership({ id: id, name: name, dataUrl: dataUrl, amount: amount });
  }

  function processFollow(
    address followerAddress,
    uint256 profileId,
    bytes calldata data
  ) external override {
    (address currencyAddress, uint256 amount) = abi.decode(data, (address, uint256));
    FollowerData memory follower = FollowerData({ followerAddress: followerAddress, amount: amount });

    _profiles[profileId].followers[followerAddress] = follower;
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
