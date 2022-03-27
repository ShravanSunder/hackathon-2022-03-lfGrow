/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';

import { task } from 'hardhat/config';
import { HttpNetworkUserConfig } from 'hardhat/types';

import { DEBUG, config } from '../hardhat.config';
import '../helpers/hardhat-imports';

import { getMnemonic, mnemonicPath } from './functions/mnemonic';

export const getAccountData = async (mnemonic: string): Promise<{ address: string }> => {
  const hdkey = require('ethereumjs-wallet/hdkey');
  const bip39 = require('bip39');
  if (DEBUG) console.log('mnemonic', mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  if (DEBUG) console.log('seed', seed);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const walletHdPath = "m/44'/60'/0'/0/";
  const accountIndex = 0;
  const fullPath = walletHdPath + accountIndex.toString();
  if (DEBUG) console.log('fullPath', fullPath);
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = `0x${wallet._privKey.toString('hex')}`;
  if (DEBUG) console.log('privateKey', privateKey);
  const EthUtil = require('ethereumjs-util');
  const address = `0x${EthUtil.privateToAddress(wallet._privKey).toString('hex')}`;
  return { address };
};

task('account', 'Get balance informations for the deployment account.', async (_, { ethers }) => {
  const { address } = await getAccountData(getMnemonic());

  const qrcode = require('qrcode-terminal');
  qrcode.generate(address);
  console.log(`‍📬 Deployer Account is ${address}`);
  for (const n in config.networks) {
    // console.log(config.networks[n],n)
    try {
      const { url } = config.networks[n] as HttpNetworkUserConfig;
      const provider = new ethers.providers.JsonRpcProvider(url);
      const balance = await provider.getBalance(address);
      console.log(` -- ${n} --  -- -- 📡 `);
      console.log(`   balance: ${ethers.utils.formatEther(balance)}`);
      console.log(`   nonce: ${await provider.getTransactionCount(address)}`);
    } catch (e) {
      if (DEBUG) console.log(e);
    }
  }
});
