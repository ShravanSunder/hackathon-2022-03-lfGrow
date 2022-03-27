import { JsonRpcSigner, Provider } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers';
import { task } from 'hardhat/config';
import { getAccountData } from 'tasks/functions/getAccountData';
import { getMnemonic } from 'tasks/functions/mnemonic';

import { LensHub__factory, PatronFollowModule__factory } from '../../generated/contract-types';
import { DataTypes } from '../../generated/contract-types/LensHub';
import followModule from '../../generated/deployments/localhost/PatronFollowModule.json';
import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from '../helpers/utils';

task('create-profile', 'creates a profile')
  .addPositionalParam('profileAddress', 'Set the profile address')
  .setAction(async ({ profileAddress }: { profileAddress: string }, hre) => {
    await hre.run('unpause');

    const [governance, , user] = await initEnv(hre);
    const account = await getAccountData(getMnemonic());
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    console.log('whitelist follow module...');
    await waitForTx(lensHub.whitelistFollowModule(followModule.address, true));

    console.log('whitelisted profile creator...');
    await waitForTx(lensHub.whitelistProfileCreator(account.address, true));
    await waitForTx(lensHub.whitelistProfileCreator(user.address, true));

    const inputStruct: DataTypes.CreateProfileDataStruct = {
      to: user.address,
      handle: 'zer0dot',
      imageURI: 'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
      followModule: ZERO_ADDRESS,
      followModuleData: [],
      followNFTURI: 'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
    };

    console.log('creating profile...');

    await waitForTx(lensHub.connect(user).createProfile(inputStruct));
    console.log('creating setup follow module..');

    console.log(`Total supply (should be 1): ${await lensHub.totalSupply()}`);
    console.log(`Profile owner: ${await lensHub.ownerOf(1)}, user address (should be the same): ${user.address}`);
    console.log(`Profile ID by handle: ${await lensHub.getProfileIdByHandle('zer0dot')}`);
  });

task('set-follow-module', 'sets the patron follow module')
  .addPositionalParam('profileId')
  .setAction(async ({ profileId }: { profileId: number }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const account = await getAccountData(getMnemonic());
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    console.log('whitelist follow module...');
    await waitForTx(lensHub.whitelistFollowModule(followModule.address, true));

    console.log('set follow module...');
    await waitForTx(lensHub.connect(user).setFollowModule(profileId, ZERO_ADDRESS, []));
    await waitForTx(lensHub.connect(user).setFollowModule(profileId, followModule.address, []));
  });

task('set-memberships-example', 'creates memberships data for a profile')
  .addPositionalParam('profileId')
  .setAction(async ({ profileId }: { profileId: number }, hre) => {
    const [governance, , user] = await initEnv(hre);
    const account = await getAccountData(getMnemonic());
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);
    const profile = PatronFollowModule__factory.connect(followModule.address, user);

    console.log('start setting memberships...');

    await profile.setMembership(profileId, 1, 'Supporter', 'https://s3/secretstuff/', 1);
    await profile.setMembership(profileId, 2, 'Believer', 'https://s3/secretstuff/', 5);
    await profile.setMembership(profileId, 3, 'Fundie', 'https://s3/secretstuff/', 10);
    await profile.setMembership(profileId, 4, 'Paragon', 'https://s3/secretstuff/', 50);

    console.log('done setting memberships');
  });

task('set-followers-example', 'creates memberships data for a profile')
  .addPositionalParam('profileId')
  .setAction(async ({ profileId }: { profileId: number }, hre) => {
    const [governance, , user, user2] = await initEnv(hre);
    const account = await getAccountData(getMnemonic());
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], user2);

    console.log('start setting followers...');

    await lensHub.follow([profileId], [[]]);

    console.log('done setting followers');
  });
