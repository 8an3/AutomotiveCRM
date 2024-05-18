import { useMatches } from '@remix-run/react';
import React, { useState, useEffect } from 'react';
import { User } from '~/models/user.server';
//https://github.com/nzambello/work-timer/blob/main/app/components/TimeElapsed.tsx
export interface Props {
  startTime: Date | string;
  endTime?: Date | string | null;
}

const TimeElapsed = ({ startTime, endTime }: Props) => {
  let user = useMatches().find((m) => m.id === 'root')?.data?.user as
    | User
    | undefined;
  const [elapsed, setElapsed] = useState(
    (new Date(endTime || Date.now()).getTime() -
      new Date(startTime).getTime()) /
    1000
  );

  useEffect(() => {
    if (endTime) {
      setElapsed(
        (new Date(endTime || Date.now()).getTime() -
          new Date(startTime).getTime()) /
        1000
      );
      return;
    }
    const interval = setInterval(() => {
      setElapsed(
        (new Date(endTime || Date.now()).getTime() -
          new Date(startTime).getTime()) /
        1000
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const hours = Math.floor(elapsed / 60 / 60);
  const minutes = Math.floor((elapsed - hours * 60 * 60) / 60);
  const seconds = Math.floor(elapsed - hours * 60 * 60 - minutes * 60);

  const hoursString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className='flex items-center justify-center flex-col'

    >
      <pre
        style={{
          fontSize: '1rem',
          margin: 0
        }}
      >
        <code>{hoursString}</code>
      </pre>
      {isClient && (
        <div
          styles={{
            display: 'none'
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              margin: 0
            }}
          >
            <span>
              {Intl.DateTimeFormat(user?.dateFormat || 'en-GB', {
                hour: '2-digit',
                minute: '2-digit'
              }).format(new Date(startTime))}
            </span>
            <span dangerouslySetInnerHTML={{ __html: '&nbsp;&mdash;&nbsp;' }} />
            <span>
              {endTime
                ? Intl.DateTimeFormat(user?.dateFormat || 'en-GB', {
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(new Date(endTime))
                : 'now'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeElapsed;
