pragma solidity 0.8.10;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import { IFollowModule } from "./lens-protocol/interfaces/IFollowModule.sol";
import { FeeModuleBase } from "./lens-protocol/core/modules/FeeModuleBase.sol";
import { FollowValidatorFollowModuleBase } from "./lens-protocol/core/modules/follow/FollowValidatorFollowModuleBase.sol";

// test profile address: 0xb212a727DD414c9cc309F7C663c5753D170AFF28

contract PatronFollowModule is IFollowModule, FollowValidatorFollowModuleBase {
  string public purpose = "Building Unstoppable Apps!!!";

  constructor(address hub) FeeModuleBase(hub) {
    // what should we do on deploy?
  }

  function initializeFollowModule(uint256 profileId, bytes calldata data) external override onlyHub returns (bytes memory) {}

  function processFollow(
    address follower,
    uint256 profileId,
    bytes calldata data
  ) external override {}

  function followModuleTransferHook(
    uint256 profileId,
    address from,
    address to,
    uint256 followNFTTokenId
  ) external override {}
}
