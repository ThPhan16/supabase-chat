'use client';
import CopyIcon from '@/assets/copy.png';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

export const GameId = (props: { gameId: string }) => {
  const { gameId } = props;

  const [showCopyLabel, setShowCopyLabel] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.origin}/join/${gameId}`);
    toast.success('copied!');
  };

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-4xl w-full text-center mt-8'>Lobby</h1>
      <p className='text-md font-bold flex items-center gap-2'>
        <span className='font-normal'>GameId:</span>
        <span className='font-normal whitespace-nowrap max-w-32 text-ellipsis overflow-hidden'>
          {gameId}
        </span>
        <div className='relative'>
          {gameId ? (
            <Image
              src={CopyIcon}
              alt=''
              width={20}
              height={20}
              onClick={handleCopy}
              style={{
                marginLeft: 2,
                cursor: 'pointer',
              }}
              onMouseEnter={() => {
                setShowCopyLabel(true);
              }}
              onMouseOut={() => {
                setShowCopyLabel(false);
              }}
            />
          ) : null}
          {showCopyLabel ? (
            <span className='absolute left-2 bottom-6 hidden1 text-xs font-normal'>
              copy
            </span>
          ) : null}
        </div>
      </p>
      <ul className='w-full'>
        <p className='w-full text-center text-2xl p-4 pb-2'>Rules</p>
        <li>- Each game last 60 seconds</li>
        <li>- For every hit, you have 1 point</li>
        <li>- If you miss 3 times, 1 point will be taken</li>
      </ul>
    </div>
  );
};
