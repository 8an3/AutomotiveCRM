import React, { useEffect, useRef, useState } from "react";
import slider from '~/styles/slider.css'
import secondary from '~/styles/secondary.css'
import ChatChannel from '~/styles/ChatChannel.css'
import messageBubble from '~/styles/messageBubble.css'
import { type LinksFunction } from '@remix-run/node';
import { Button } from '../ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { useFetcher } from '@remix-run/react';
import { prisma } from "~/libs";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: secondary },
  { rel: "stylesheet", href: ChatChannel },
  { rel: "stylesheet", href: messageBubble },
];

function ChannelsList({ channels, selectedChannel, onChannelClick, messages }) {
  if (!Array.isArray(channels) || channels.length === 0) {
    // If channels is not an array or doesn't exist, handle it accordingly
    return <p>No channels available.</p>;
  }

  const conversations = useFetcher()
  return (
    <div>

      <ul>
        {channels.map((item, index) => {
          const activeChannel = item.conversationSid === selectedChannel;
          const channelItemClassName = `channel-item${activeChannel ? ' channel-item--active' : ''}`;
          console.log(item)
          const currentDate = new Date();
          const itemDate = new Date(item.dateUpdated);
          let formattedDate;
          if (
            itemDate.getDate() === currentDate.getDate() &&
            itemDate.getMonth() === currentDate.getMonth() &&
            itemDate.getFullYear() === currentDate.getFullYear()
          ) {
            formattedDate = itemDate.toLocaleTimeString();
          } else { formattedDate = itemDate.toLocaleDateString(); }
          return (
            <li key={index} onClick={() => {
              onChannelClick(item.conversationSid)
              conversations.submit(event?.target.form)
              fetch.get(`/resource/get-conversation/${item.conversationSid}`)
            }}
              className={`channel-item m-2 mx-auto w-[95%] cursor-pointer rounded-md border  border-[#ffffff4d] hover:border-primary hover:text-primary active:border-primary${activeChannel ? ' channel-item--active' : ''}`}>
              <conversations.Form method='get' action='/get-conversation' >

                <div className="m-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">
                    <strong>{item.friendlyName || item.sid}</strong>
                  </span>
                  <p className={`text-sm text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-foreground' : ''}`}>
                    {formattedDate}
                  </p>
                </div>
                <p className={`text-sm m-2 text-[#ffffff7c] ${activeChannel ? ' channel-item--active text-foreground' : ''}`}>
                  {messages[0].body ? messages[0].body.split(' ').slice(0, 12).join(' ') + '...' : ''}
                </p>
              </conversations.Form>

            </li>

          );
        })}
      </ul>
    </div >
  );
}

export default ChannelsList;
