/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  createConnectorForExternalContract,
  createConnectorForHardhatContract,
  createConnectorForExternalAbi,
} from 'eth-hooks/context';

import hardhatContractsJson from '../generated/hardhat_contracts.json';

import { externalContractsAddressMap } from './externalContracts.config';

import { TARGET_NETWORK_INFO } from '~~/config/app.config';
import * as hardhatContracts from '~~/generated/contract-types';
import * as externalContracts from '~~/generated/external-contracts/esm/types';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * ### Instructions
 * 1. edit externalContractsConfig.ts to add your external contract addresses.
 * 2. edit `contractConnectorConfig` function below and add them to the list
 * 3. run `yarn contracts:build` to generate types for contracts
 * 4. run `yarn deploy` to generate hardhat_contracts.json
 *
 * ### Summary
 * - called  by useAppContracts
 * @returns
 */
export const appContractsConfig = () => {
  try {
    const result = {
      // 🙋🏽‍♂️ Add your hadrdhat contracts here
      PatronFollowModule: createConnectorForHardhatContract(
        'PatronFollowModule',
        hardhatContracts.PatronFollowModule__factory,
        hardhatContractsJson
      ),
      // LensHub: createConnectorForHardhatContract('LensHub', hardhatContracts.LensHub__factory, hardhatContractsJson),

      // 🙋🏽‍♂️ Add your external contracts here, make sure to define the address in `externalContractsConfig.ts`
      DAI: createConnectorForExternalContract('DAI', externalContracts.DAI__factory, externalContractsAddressMap),
      // LENS_HUB: createConnectorForExternalContract(
      //   'LENS_HUB',
      //   externalContracts.LENSHUB__factory,
      //   externalContractsAddressMap
      // ),

      // 🙋🏽‍♂️ Add your external abi here (unverified contracts)`
      LENS_HUB: createConnectorForExternalAbi(
        'LENS_HUB',
        {
          [TARGET_NETWORK_INFO.chainId]: {
            address: '0xD036a8F254ef782cb93af4F829A1568E992c3864',
            chainId: TARGET_NETWORK_INFO.chainId,
          },
        },
        hardhatContracts.LensHub__factory.abi,
        hardhatContracts.LensHub__factory.connect
      ),
    } as const;

    return result;
  } catch (e) {
    console.error(
      '❌ contractConnectorConfig: ERROR with loading contracts please run `yarn contracts:build or yarn contracts:rebuild`.  Then run `yarn deploy`!',
      e
    );
  }

  return undefined;
};

/**
 * ### Summary
 * This type describes all your contracts, it is the return of {@link appContractsConfig}
 */
export type TAppConnectorList = NonNullable<ReturnType<typeof appContractsConfig>>;
