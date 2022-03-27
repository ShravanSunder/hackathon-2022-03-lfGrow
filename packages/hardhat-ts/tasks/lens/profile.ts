import { task } from 'hardhat/config';
import { getAccountData } from 'tasks/functions/getAccountData';
import { getMnemonic } from 'tasks/functions/mnemonic';

import { LensHub__factory } from '../../generated/contract-types';
import { DataTypes } from '../../generated/contract-types/LensHub';
import followModule from '../../generated/deployments/localhost/PatronFollowModule.json';
import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from '../helpers/utils';

task('create-profile', 'creates a profile')
  .addPositionalParam('profileAddress', 'Set the profile address')
  .setAction(async ({ profileAddress }: { profileAddress: string }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const account = await getAccountData(getMnemonic(), hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    await waitForTx(lensHub.whitelistProfileCreator(account.address, true));
    const inputStruct: DataTypes.CreateProfileDataStruct = {
      to: account.address,
      handle: 'zer0dot',
      imageURI: 'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
      followModule: followModule.address,
      followModuleData: [],
      followNFTURI: 'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
    };

    await waitForTx(lensHub.connect(account.signer).createProfile(inputStruct));

    console.log(`Total supply (should be 1): ${await lensHub.totalSupply()}`);
    console.log(`Profile owner: ${await lensHub.ownerOf(1)}, user address (should be the same): ${user.address}`);
    console.log(`Profile ID by handle: ${await lensHub.getProfileIdByHandle('zer0dot')}`);
  });
