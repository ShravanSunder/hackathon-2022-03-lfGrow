import { task } from 'hardhat/config';
import { getAccountData } from 'tasks/account';
import { getMnemonic } from 'tasks/functions/mnemonic';

task('faucet', 'Sends ETH and tokens to an address')
  .addPositionalParam('receiver', 'The address that will receive them')
  .setAction(async ({ receiver }, { ethers }) => {
    const { address } = await getAccountData(getMnemonic());

    const [sender] = await ethers.getSigners();

    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,
    });
    await tx2.wait();

    console.log(`Transferred 1 ETH and 100 tokens to ${address}`);
  });
