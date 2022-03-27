import { useContractReader } from 'eth-hooks';
import { useEthersContext } from 'eth-hooks/context';
import { FC, ReactElement } from 'react';

import { useAppContracts } from '~~/components/contractContext';

export const MyProfile: FC = () => {
  const ethersContext = useEthersContext();
  const lensHub = useAppContracts('LensHub', ethersContext.chainId);
  const patronContract = useAppContracts('PatronFollowModule', ethersContext.chainId);

  const [myProfile] = useContractReader(patronContract, patronContract?._profiles, [1]);

  const loading = <>{myProfile == null && <progress className="w-56 progress"></progress>}</>;

  let profileDetails: ReactElement | undefined = undefined;
  if (myProfile) {
    profileDetails = (
      <>
        <div className="text-lg columns-1">Profile Details</div>
        <div className="grid grid-cols-2 gap-5 justify-items-start">
          <div className="text-m columns-1">Profile Id</div>
          <div className="text-m columns-2">{myProfile.profileId?.toString() ?? ''}</div>
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
        <div className="p-10"></div>
        {loading}
        {profileDetails}
      </div>
    </>
  );
};
