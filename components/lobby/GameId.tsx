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
    <div>
      <h1 className='text-4xl mt-8'>Lobby</h1>
      <h1 className='text-md font-bold flex items-center gap-2'>
        <span className='font-normal'>GameId:</span>
        <span className='font-normal'>{gameId}</span>
        <div className='relative'>
          {gameId ? (
            <Image
              src={CopyIcon}
              alt=''
              width={20}
              height={20}
              onClick={handleCopy}
              style={{
                marginLeft: 12,
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
      </h1>
    </div>
  );
};
