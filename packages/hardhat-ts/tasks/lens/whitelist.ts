import { LensHub, LensHub__factory } from 'generated/contract-types';
import { task } from 'hardhat/config';

import followModule from '../../generated/deployments/localhost/PatronFollowModule.json';
import { ProtocolState, waitForTx, initEnv, getAddrs } from '../helpers/utils';

task('whitelist-follow-module', 'unpauses the protocol').setAction(async ({ address }: { address: string }, hre) => {
  await hre.run('unpause');

  const [governance] = await initEnv(hre);
  const addrs = getAddrs();
  const lensHub: LensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);
  await waitForTx(lensHub.whitelistFollowModule(followModule.address, true));
  console.log('whitelisted follow module...', address);
});
