import React from 'react';

function ChannelsList({ channels, selectedChannelSid, onChannelClick }) {
  return (
    <div>
      <h2>Open Conversations</h2>
      <ul className="chat-channels-list">
        {channels.map((item) => {
          const activeChannel = item.sid === selectedChannelSid;
          const channelItemClassName = `channel-item${activeChannel ? ' channel-item--active' : ''}`;

          return (
            <li key={item.sid} onClick={() => onChannelClick(item)} className={channelItemClassName}>
              <span className="channel-item-text">
                <strong>{item.friendlyName || item.sid}</strong>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ChannelsList;
