import { LensHub, LensHub__factory } from 'generated/contract-types';
import { task } from 'hardhat/config';

import { ProtocolState, waitForTx, initEnv, getAddrs } from '../helpers/utils';

// task('set-governance', 'unpauses the protocol')
//   .addPositionalParam('address', 'The address that will be the new governance address')
//   .setAction(async ({ address }: { address: string }, hre) => {
//     await hre.run('unpause');

//     const [governance] = await initEnv(hre);
//     const addrs = getAddrs();
//     const lensHub: LensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);
//     await waitForTx(lensHub.setGovernance(address));
//   });
