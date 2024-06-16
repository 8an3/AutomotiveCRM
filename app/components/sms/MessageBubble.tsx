import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import slider from '~/styles/slider.css'
import ChatChannel from '~/styles/ChatChannel.css'
import { type LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: ChatChannel },
];

const MessageBubble = ({ message, direction }) => {
  const [hasMedia, setHasMedia] = useState(message.type === 'media');
  const [mediaDownloadFailed] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [type, setType] = useState(null);

  /**  useEffect(() => {
      const fetchData = async () => {
        setType((await message.getMember()).type);

        if (hasMedia) {
          try {
            const url = await message.media.getContentUrl();
            setMediaUrl(url);
          } catch (e) {
            setMediaDownloadFailed(true);
          }
        }

        document.getElementById(message.conversationSid).scrollIntoView({ behavior: 'smooth' });
      };

      fetchData();
    }, [message, hasMedia]); */

  const { itemStyle, divStyle } = direction === 'incoming'
    ? { itemStyle: "inline-block px-0 py-0 pl-10 align-bottom w-full my-1", divStyle: "bg-black w-[55%] rounded-lg text-foreground m-0 px-1 pl-5 mt-2" }
    : { itemStyle: " w-full pr-10 justify-self-end my-1", divStyle: "w-[55%] ml-auto my-1 float-right bg-black rounded-lg text-right  text-foreground pr-5 p-1 mt-2" };
  //: { itemStyle: " overflow-hidden pr-5 my-26 w-[55%]", divStyle: "bg-myColor-900 my-1 rounded-lg  text-right w-full p-5 pr-12" };

  /**<strong>
              {message.type === 'whatsapp' && <span role="img" aria-label="whatsapp icon">📱</span>}
              {message.type === 'chat' && <span role="img" aria-label="chat icon">💬</span>}
              {message.type === 'sms' && <span role="img" aria-label="sms icon">📲</span>}
            </strong>
            <br />
            */
  const currentDate = new Date();
  const itemDate = new Date(message.date_created);
  let formattedDate;

  if (
    itemDate.getDate() === currentDate.getDate() &&
    itemDate.getMonth() === currentDate.getMonth() &&
    itemDate.getFullYear() === currentDate.getFullYear()
  ) {
    formattedDate = itemDate.toLocaleTimeString();
  } else {
    formattedDate = itemDate.toLocaleDateString();
  }
  // {` ${message.author} `}

  return (
    <li id={message.conversationSid} className={itemStyle}>
      <div className={divStyle}>
        <div>

          <div className="flex justify-start items-center flex-wrap">
            {hasMedia && <Media hasFailed={mediaDownloadFailed} url={mediaUrl} />}
          </div>
          {message.body}
        </div>
        <span className="text-[#747474] block text-[12px] mt-4">   {formattedDate}</span>
      </div>
    </li>
  );
};

const Media = ({ hasFailed, url }) => {
  return (
    <div
      className={`rounded-[4px] cursor-pointer m-4 flex w-[220px] h-[220px] justify-center items-center ${!url ? 'bg-[rgba(22,46,52,0.58)]' : ''}`}
      onClick={() => {
        if (url) {
          // Handle custom modal or lightbox for media preview
          // You can use a state variable to manage modal visibility
          alert('Implement your own media preview');
        }
      }}
    >
      {!url && !hasFailed && <div className="border border-border bg-black"></div>}


      {hasFailed && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span role="img" aria-label="warning icon">⚠️</span>
          <p>Failed to load media</p>
        </div>
      )}

      {!hasFailed && url && (
        <div className="m-4 relative rounded-[4px] top-0 overflow-hidden h-[220px] w-[220px] flex justify-center items-center flex-shrink-0 flex-basis-[220px]">
          <div className="bg-cover bg-center" style={{ backgroundImage: `url(${url})` }}>
            <span role="img" aria-label="eye icon" className="text-[#747474] block text-[12px] mt-8">👁️</span>
          </div>
        </div>
      )}
    </div>
  );
};

Media.propTypes = {
  hasFailed: PropTypes.bool.isRequired,
  url: PropTypes.string,
};

export default MessageBubble;
