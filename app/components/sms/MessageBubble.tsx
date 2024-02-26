import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import slider from '~/styles/slider.css'
import secondary from '~/styles/secondary.css'
import ChatChannel from '~/styles/ChatChannel.css'
import messageBubblew from '~/styles/messageBubble.css'
import { type LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: secondary },
  { rel: "stylesheet", href: ChatChannel },
  { rel: "stylesheet", href: messageBubblew },
];

const MessageBubble = ({ message, direction }) => {
  const [hasMedia, setHasMedia] = useState(message.type === 'media');
  const [mediaDownloadFailed, setMediaDownloadFailed] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
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
  }, [message, hasMedia]);

  const { itemStyle, divStyle } = direction === 'incoming'
    ? { itemStyle: styles.received_msg, divStyle: styles.received_withd_msg }
    : { itemStyle: styles.outgoing_msg, divStyle: styles.sent_msg };

  return (
    <li id={message.conversationSid} className={itemStyle}>
      <div className={divStyle}>
        <div>
          <strong>
            {type === 'whatsapp' && <span role="img" aria-label="whatsapp icon">📱</span>}
            {type === 'chat' && <span role="img" aria-label="chat icon">💬</span>}
            {type === 'sms' && <span role="img" aria-label="sms icon">📲</span>}
            {` ${message.author}`}
          </strong>
          <br />
          <div className={styles.medias}>
            {hasMedia && <Media hasFailed={mediaDownloadFailed} url={mediaUrl} />}
          </div>
          {message.body}
        </div>
        <span className={styles.time_date}>{message.timestamp.toLocaleString()}</span>
      </div>
    </li>
  );
};

const Media = ({ hasFailed, url }) => {
  return (
    <div
      className={`${styles.media}${!url ? ' ' + styles.placeholder : ''}`}
      onClick={() => {
        if (url) {
          // Handle custom modal or lightbox for media preview
          // You can use a state variable to manage modal visibility
          alert('Implement your own media preview');
        }
      }}
    >
      {!url && !hasFailed && <div className={styles.spinner}></div>}

      {hasFailed && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span role="img" aria-label="warning icon">⚠️</span>
          <p>Failed to load media</p>
        </div>
      )}

      {!hasFailed && url && (
        <div className={styles.media_icon}>
          <div className={styles.picture_preview} style={{ backgroundImage: `url(${url})` }}>
            <span role="img" aria-label="eye icon" className={styles.eyeIcon}>👁️</span>
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
