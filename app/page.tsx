'use client';
import React from 'react';
import constant from '@/app/constant';
import Image from 'next/image';
import { useChat } from '@/hooks/home';

export default function HomePage() {
  const { isLoading, messageRef, messages, input, handleSubmit, setInput, inputRef } = useChat();

  return (
    <main className="mx-auto flex h-screen max-w-xl flex-col bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b border-gray-300 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {constant.site_title}
        </h1>
      </header>

      <section className="chat-scroll flex-1 space-y-6 overflow-y-auto px-4 py-6">
        <div className="space-y-6" ref={messageRef}>
          {messages?.length > 0 &&
            messages.map((item, idx) =>
              item.parts.map((part, partIndex) => {
                const isUser = item.role === 'user';
                return (
                  <div
                    key={partIndex}
                    className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                        isUser
                          ? 'rounded-br-none bg-blue-600 text-white'
                          : 'rounded-bl-none border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'
                      }`}
                    >
                      {part?.text}
                      {item.timestamp && (
                        <div className="mt-2 text-xs text-gray-200 opacity-70 dark:text-gray-300">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow dark:border-gray-600 dark:bg-gray-700">
                <Image
                  src="/assets/images/Ai-thinking.gif"
                  width={100}
                  height={30}
                  alt="Thinking"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-gray-300 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            type="text"
            className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            placeholder={constant.placeholder}
          />

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-3 text-white shadow transition-all hover:bg-blue-700"
          >
            {constant.send}
          </button>
        </form>
      </footer>
    </main>
  );
}
