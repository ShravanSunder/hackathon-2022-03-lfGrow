import { useContractReader } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import { ethers } from 'ethers';
import { FC, ReactElement } from 'react';

import { useAppContracts } from '~~/components/contractContext';

export const MyProfile: FC = () => {
  const ethersContext = useEthersContext();
  const lensHub = useAppContracts('LensHub', ethersContext.chainId);
  const patronContract = useAppContracts('PatronFollowModule', ethersContext.chainId);

  const [myProfile] = useContractReader(patronContract, patronContract?._profiles, [1]);

  const [myMemberships] = useContractReader(patronContract, patronContract?.getMemberships, [1]);

  const [myFollowers] = useContractReader(patronContract, patronContract?.getFollowers, [1]);

  const loading = <>{myProfile == null && <progress className="w-56 progress"></progress>}</>;

  let profileDetails: ReactElement | undefined = undefined;
  if (myProfile) {
    profileDetails = (
      <>
        <div className="p-2 text-lg capitalize">Profile Details</div>
        <div className="justify-between grid grid-cols-3 gap-x-20 gap-y-4 justify-items-start">
          <div className="text-m columns-1">Profile Id</div>
          <div className="text-m columns-2 col-span-2">{myProfile.profileId?.toString() ?? ''}</div>
          <div className="text-m columns-1">Address</div>
          <div className="text-m columns-2 col-span-2">{myProfile.profileAddress?.toString() ?? ''}</div>
        </div>
      </>
    );
  }

  let membershipDetails: ReactElement | undefined = undefined;
  if (myMemberships) {
    membershipDetails = (
      <>
        <div className="p-2 text-lg capitalize ">Membership Level Details</div>
        <div className="grid grid-cols-3 gap-x-20 gap-y-4 justify-items-start">
          {myMemberships.map((membership) => {
            return (
              <>
                <div className="text-m columns-1">Membership Id</div>
                <div className="text-m columns-2 col-span-2">{membership.id}</div>
                <div className="text-m columns-1">Minimum Amount</div>
                <div className="text-m columns-2 col-span-2">{ethers.utils.formatEther(membership.minAmount)}</div>
                <div className="text-m columns-1">More Data (can be json to load)</div>
                <div className="text-m columns-2 col-span-2">{membership.dataUrl}</div>
              </>
            );
          })}
        </div>
      </>
    );
  }

  let followersDetails: ReactElement | undefined = undefined;
  if (myFollowers) {
    followersDetails = (
      <>
        <div className="p-2 text-lg capitalize">Follower Details</div>
        <div className="grid grid-cols-3 gap-x-20 gap-y-4 justify-items-start">
          {myFollowers.map((follower) => {
            return (
              <>
                <div className="text-m columns-1"> Follower Address</div>
                <div className="text-m columns-2 col-span-2">{follower.followerAddress}</div>
                <div className="text-m columns-1"> Last Payment</div>
                <div className="text-m columns-2 col-span-2">{follower.lastPaymentAmount}</div>
                <div className="text-m columns-1"> Last Payed date</div>
                <div className="text-m columns-2 col-span-2">{follower.lastPaymentTimestamp}</div>
              </>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <img className="rounded-b-lg" src="https://picsum.photos/600/200" />
        <div className="-mt-16 avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src="https://api.lorem.space/image/face?hash=3174" />
          </div>
        </div>
        <div className="mt-4 text-lg font-semibold">Otis P. Smith</div>
        <div className="p-12"></div>
        {loading}
        {profileDetails}
        <div className="p-8"></div>
        {membershipDetails}
        <div className="p-8"></div>
        {followersDetails}
      </div>
    </>
  );
};
