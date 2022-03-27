import { useContractReader } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
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
        <div className="p-2  pt-8  text-2xl font-bold capitalize">Profile Details</div>
        <div className="justify-between grid grid-cols-3 gap-x-20 gap-y-4 justify-items-start">
          <div className="text-m columns-1 border-slate-500  ">Profile Id</div>
          <div className="text-m columns-2 col-span-2">{myProfile.profileId?.toString() ?? ''}</div>
          <div className="text-m columns-1  border-slate-500">Address</div>
          <div className="text-m columns-2 col-span-2">{myProfile.profileAddress?.toString() ?? ''}</div>
        </div>
      </>
    );
  }

  let membershipDetails: ReactElement | undefined = undefined;
  if (myMemberships) {
    membershipDetails = (
      <>
        <div className="p-2 pt-8 text-2xl font-bold capitalize">Membership Level Details</div>

        {myMemberships.map((membership, i) => {
          return (
            <div key={i} className="p-4">
              <div className="bg-purple-900 shadow-xl card lg:card-side">
                <figure className="p-0 m-0">
                  <img src={`https://api.lorem.space/image/furniture?w=400&h=400&t=${i}`} alt="levels" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{membership.name}</h2>
                  <>
                    <div className="grid grid-cols-3 gap-x-20 gap-y-4 justify-items-start">
                      <div className="pt-2 col-span-3"></div>
                      <div className="text-m columns-1 border-slate-500">Membership Id</div>
                      <div className="font-light text-m columns-2 col-span-2">{membership.id}</div>
                      <div className="text-m columns-1  border-slate-500">Minimum Amount</div>
                      <div className="font-light text-m columns-2 col-span-2">
                        {'$' + `${membership.minAmount?.toString()}`}
                      </div>
                      <div className="text-m columns-1 border-slate-500">Data url</div>
                      <div className="font-light text-m columns-2 col-span-2">{membership.dataUrl}</div>
                    </div>
                  </>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  let followersDetails: ReactElement | undefined = undefined;
  if (myFollowers) {
    followersDetails = (
      <>
        <div className="p-2  pt-8 text-2xl font-bold capitalize">Follower Details</div>
        {myFollowers.map((follower, i) => {
          return (
            <div key={i} className="p-4">
              <div className="bg-purple-900 shadow-xl card lg:card-side">
                <figure className="p-0 m-0">
                  <img src={`https://api.lorem.space/image/fashion?w=300&h=300&t=${i}`} alt="levels" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{follower.name}</h2>
                  <>
                    <div className="grid grid-cols-3 gap-x-20 gap-y-4 justify-items-start">
                      <div className="p-4 col-span-3"></div>
                      <div className="text-m columns-1"> Follower Address</div>
                      <div className="font-light text-m columns-2 col-span-2">{follower.followerAddress}</div>
                      <div className="text-m columns-1"> Last Payment</div>
                      <div className="font-light text-m columns-2 col-span-2">
                        {follower.lastPaymentAmount?.toString()}
                      </div>
                      <div className="text-m columns-1"> Last Payed date</div>
                      <div className="font-light text-m columns-2 col-span-2">
                        {new Date(follower.lastPaymentTimestamp?.toString()).toLocaleDateString()}
                      </div>
                      <div className="text-m columns-1"> Is Active</div>
                      <div className="font-light text-m columns-2 col-span-2">
                        {follower?.isActive.toString() === 'true' ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </div>
          );
        })}
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
        <div className="mt-4 text-lg font-semibold">Shravan's Patreon Details</div>
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
