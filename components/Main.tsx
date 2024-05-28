'use client';
import { UserState } from '@/lib/store/user';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatAbout from './ChatAbout';
import { ETab, useTab } from '@/lib/store/tab';
import WhackAMole from './WhackAMole';

export default function Main({ user }: { user: UserState['user'] }) {
  const tab = useTab((s) => s.tab);
  const chatTab = tab === ETab.CHAT;

  return (
    <div
      className={`h-[calc(100%-80px)] mx-auto md:p-10 ${
        chatTab ? 'max-w-3xl' : ''
      }`}
    >
      <div
        className={`h-full ${
          chatTab ? 'border rounded-md' : ''
        } flex flex-col relative`}
      >
        {user ? (
          chatTab ? (
            <>
              <ChatMessages />
              <ChatInput />
            </>
          ) : (
            <WhackAMole />
          )
        ) : (
          <ChatAbout />
        )}
      </div>
    </div>
  );
}
