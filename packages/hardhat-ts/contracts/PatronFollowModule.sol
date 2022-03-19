pragma solidity 0.8.10;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import { IFollowModule } from "./lens-protocol/interfaces/IFollowModule.sol";
import { ModuleBase } from "./lens-protocol/core/modules/ModuleBase.sol";
import { FeeModuleBase } from "./lens-protocol/core/modules/FeeModuleBase.sol";
import { FollowValidatorFollowModuleBase } from "./lens-protocol/core/modules/follow/FollowValidatorFollowModuleBase.sol";

// test profile address: 0xb212a727DD414c9cc309F7C663c5753D170AFF28

contract PatronFollowModule is IFollowModule, FeeModuleBase, FollowValidatorFollowModuleBase {
  string public purpose = "Building Unstoppable Apps!!!";

  constructor(address hub, address globals) ModuleBase(hub) FeeModuleBase(globals) {
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
