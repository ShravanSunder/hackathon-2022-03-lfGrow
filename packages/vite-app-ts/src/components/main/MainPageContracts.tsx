import { GenericContract } from 'eth-components/ant/generic-contract';
import { useEthersContext } from 'eth-hooks/context';
import React, { FC } from 'react';

import { useAppContracts } from '~~/components/contractContext';
import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { NETWORKS } from '~~/models/constants/networks';
export interface IMainPageContractsProps {
  scaffoldAppProviders: IScaffoldAppProviders;
}

/**
 * 🎛 this scaffolding is full of commonly used components
    this <GenericContract/> component will automatically parse your ABI
    and give you a form to interact with it locally
 * @param props 
 * @returns 
 */
export const MainPageContracts: FC<IMainPageContractsProps> = (props) => {
  const ethersContext = useEthersContext();
  const mainnetDai = useAppContracts('DAI', NETWORKS.mainnet.chainId);
  const patronFollow = useAppContracts('PatronFollowModule', ethersContext.chainId);

  if (ethersContext.account == null) {
    return <></>;
  }

  return (
    <>
      <>
        {/* **********
          ❓ this scaffolding is full of commonly used components
          this <Contract/> component will automatically parse your ABI
          and give you a form to interact with it locally
        ********** */}
        <GenericContract
          contractName="ProfileFollowContract"
          contract={patronFollow}
          mainnetAdaptor={props.scaffoldAppProviders.mainnetAdaptor}
          blockExplorer={props.scaffoldAppProviders.targetNetwork.blockExplorer}
        />

        {/* **********
         * ❓ uncomment for a second contract:
         ********** */}
        {/*
          <GenericContract
            contractName="SecondContract"
            contract={contract={contractList?.['SecondContract']}
            mainnetProvider={props.appProviders.mainnetProvider}
            blockExplorer={props.appProviders.targetNetwork.blockExplorer}
            contractConfig={props.contractConfig}
          />
        */}
      </>
    </>
  );
};
