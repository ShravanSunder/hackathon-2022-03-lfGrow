import { Menu } from 'antd';
import { GenericContract } from 'eth-components/ant/generic-contract';
import { useContractReader, useBalance, useEthersAdaptorFromProviderOrSigners } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import { useDexEthPrice } from 'eth-hooks/dapps';
import { asEthersAdaptor } from 'eth-hooks/functions';
import React, { FC, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import '~~/styles/main-page.css';

import { MainPageContracts, MainPageFooter, MainPageHeader } from './components/main';
import { useScaffoldHooksExamples as useScaffoldHooksExamples } from './components/main/hooks/useScaffoldHooksExamples';
import { MyProfile } from './components/pages/profile/MyProfile';
import { Profile } from './components/pages/profile/Profile';

import { useAppContracts, useConnectAppContracts, useLoadAppContracts } from '~~/components/contractContext';
import { useBurnerFallback } from '~~/components/main/hooks/useBurnerFallback';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { BURNER_FALLBACK_ENABLED, MAINNET_PROVIDER } from '~~/config/app.config';
import { NETWORKS } from '~~/models/constants/networks';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * See config/appConfig.ts for configuration, such as TARGET_NETWORK
 * See MainPageContracts.tsx for your contracts component
 * See contractsConnectorConfig.ts for how to configure your contracts
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 *
 * For more
 */

export interface IMainPageMenuProps {
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
}

export const MainPageMenu: FC<IMainPageMenuProps> = (props) => (
  <Menu
    style={{
      textAlign: 'center',
    }}
    selectedKeys={[props.route]}
    mode="horizontal">
    <Menu.Item key="/">
      <Link
        onClick={(): void => {
          props.setRoute('/');
        }}
        to="/">
        Profile
      </Link>
    </Menu.Item>
    <Menu.Item key="/my-profile">
      <Link
        onClick={(): void => {
          props.setRoute('/my-profile');
        }}
        to="/my-profile">
        My Profile Details
      </Link>
    </Menu.Item>
    <Menu.Item key="/follow-module">
      <Link
        onClick={(): void => {
          props.setRoute('/follow-module');
        }}
        to="/follow-module">
        ⚙️ PatronFollowModule
      </Link>
    </Menu.Item>
    <Menu.Item key="/lens-hub">
      <Link
        onClick={(): void => {
          props.setRoute('/lens-hub');
        }}
        to="/lens-hub">
        ⚙️ TestProfileModule
      </Link>
    </Menu.Item>
    <Menu.Item key="/mainnetdai">
      <Link
        onClick={(): void => {
          props.setRoute('/mainnetdai');
        }}
        to="/mainnetdai">
        ⚙️ Mainnet DAI
      </Link>
    </Menu.Item>
    {/* <Menu.Item key="/subgraph">
      <Link
        onClick={() => {
          props.setRoute('/subgraph');
        }}
        to="/subgraph">
        Subgraph
      </Link>
    </Menu.Item> */}
  </Menu>
);

/**
 * The main component
 * @returns
 */
export const Main: FC = () => {
  // -----------------------------
  // Providers, signers & wallets
  // -----------------------------
  // 🛰 providers
  // see useLoadProviders.ts for everything to do with loading the right providers
  const scaffoldAppProviders = useScaffoldAppProviders();

  // 🦊 Get your web3 ethers context from current providers
  const ethersContext = useEthersContext();

  // if no user is found use a burner wallet on localhost as fallback if enabled
  useBurnerFallback(scaffoldAppProviders, BURNER_FALLBACK_ENABLED);

  // -----------------------------
  // Load Contracts
  // -----------------------------
  // 🛻 load contracts
  useLoadAppContracts();
  // 🏭 connect to contracts for mainnet network & signer
  const [mainnetAdaptor] = useEthersAdaptorFromProviderOrSigners(MAINNET_PROVIDER);
  useConnectAppContracts(mainnetAdaptor);
  // 🏭 connec to  contracts for current network & signer
  useConnectAppContracts(asEthersAdaptor(ethersContext));

  // -----------------------------
  // Hooks use and examples
  // -----------------------------
  // 🎉 Console logs & More hook examples:
  // 🚦 disable this hook to stop console logs
  // 🏹🏹🏹 go here to see how to use hooks!
  useScaffoldHooksExamples(scaffoldAppProviders);

  // -----------------------------
  // These are the contracts!
  // -----------------------------

  // init contracts
  const patronFollowModule = useAppContracts('PatronFollowModule', ethersContext.chainId);
  const lensHub = useAppContracts('LensHub', ethersContext.chainId);
  const mainnetDai = useAppContracts('DAI', NETWORKS.mainnet.chainId);

  // keep track of a variable from the contract in the local React state:
  const [purpose, update] = useContractReader(patronFollowModule, patronFollowModule?.purpose, []);

  // -----------------------------
  // .... 🎇 End of examples
  // -----------------------------
  // 💵 This hook will get the price of ETH from 🦄 Uniswap:
  const [ethPrice] = useDexEthPrice(scaffoldAppProviders.mainnetAdaptor?.provider, scaffoldAppProviders.targetNetwork);

  // 💰 this hook will get your balance
  const [yourCurrentBalance] = useBalance(ethersContext.account);

  const [route, setRoute] = useState<string>('');
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  return (
    <div className="App">
      <MainPageHeader scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />

      {/* Routes should be added between the <Switch> </Switch> as seen below */}
      <BrowserRouter>
        <MainPageMenu route={route} setRoute={setRoute} />
        <Switch>
          <Route exact path="/">
            <Profile></Profile>
          </Route>
          <Route exact path="/my-profile">
            <MyProfile></MyProfile>
          </Route>
          <Route exact path="/follow-module">
            <MainPageContracts scaffoldAppProviders={scaffoldAppProviders} />
          </Route>
          <Route exact path="/lens-hub">
            <GenericContract
              contractName="Lens Hub"
              contract={lensHub}
              mainnetAdaptor={scaffoldAppProviders.mainnetAdaptor}
              blockExplorer={scaffoldAppProviders.targetNetwork.blockExplorer}
            />
          </Route>
          <Route path="/mainnetdai">
            {MAINNET_PROVIDER != null && (
              <GenericContract
                contractName="DAI"
                contract={mainnetDai}
                mainnetAdaptor={scaffoldAppProviders.mainnetAdaptor}
                blockExplorer={NETWORKS.mainnet.blockExplorer}
              />
            )}
          </Route>
        </Switch>
      </BrowserRouter>

      <MainPageFooter scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />
    </div>
  );
};
