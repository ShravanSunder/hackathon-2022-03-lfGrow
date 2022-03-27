import { useEthersContext } from 'eth-hooks/context';
import { FC } from 'react';

import { useAppContracts } from '~~/components/contractContext';

export const Profile: FC = () => {
  const ethersContext = useEthersContext();
  const lensHub = useAppContracts('LensHub', ethersContext.chainId);

  const handleFollow = (): void => {
    void lensHub?.follow([1], []);
  };

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
        <div className="font-light">is creating the best web3 content</div>
        <button className="my-4 btn btn-wide btn-success" onClick={handleFollow}>
          Become a patron
        </button>
        <div className="shadow-md rounded-md">
          <div className="flex flex-col">
            <p className="m-4 font-light">
              By becoming a patron, you will instantly unlock access to 27 exclusive posts
            </p>
            <div className="flex justify-evenly">
              <div>
                <div className="text-lg font-bold">2</div>
                <p className="text-xs font-light">writings</p>
              </div>
              <div>
                <div className="text-lg font-bold">25</div>
                <p className="text-xs font-light">videos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
