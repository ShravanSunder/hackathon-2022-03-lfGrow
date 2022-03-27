import fs from 'fs';

import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { initEnv } from 'tasks/helpers/utils';

import lensAddresses from '../addresses.json';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const [governance, , user] = await initEnv(hre);
  await deploy('PatronFollowModule', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: governance.address,
    // see https://docs.lens.dev/docs/testnet-addresses#mumbai-testnet-addresses
    args: [lensAddresses['lensHub proxy']],
    log: true,
  });

  /*
    // Getting a previously deployed contract
    const YourContract = await ethers.getContract("YourContract", deployer);
    await YourContract.setPurpose("Hello");
    
    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate aÍÍ version of a contract at a specific address!
  */
};
export default func;
func.tags = ['PatronFollowModule'];

/*
Tenderly verification
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
*/
