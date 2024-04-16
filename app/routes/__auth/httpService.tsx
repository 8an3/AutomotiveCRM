import { json } from "@remix-run/node";
import axios from "axios";
import { commitSession } from "~/sessions";

export async function RetrieveCal(accessToken) {
  let httpResp;
  await fetch('https://graph.microsoft.com/v1.0/me/calendar', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
      // Add any other headers as needed
    }
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp
}
export async function RetrieveCalEvents(accessToken) {
  let httpResp;
  await fetch('https://graph.microsoft.com/v1.0/me/calendar/events', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
      // Add any other headers as needed
    }
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp
}
export async function AddCalendarEvent(accessToken) {
  let httpResp;
  await fetch('https://graph.microsoft.com/v1.0/me/calendar/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp
}
export async function RetreiveCalendars(accessToken) {
  let httpResp;
  await fetch('https://graph.microsoft.com/v1.0/me/calendars', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function CreateCalendar(accessToken) {
  let httpResp;
  await fetch('https://graph.microsoft.com/v1.0/me/calendars', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function RetrieveEventsFromSpecCalendar(accessToken) {
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/calendars/{calendar-id}/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

} export async function GetMicroUser(accessToken) {
  try {
    const response = await fetch(`https://graph.microsoft.com/v1.0/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        // Add any other headers as needed
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error for the caller to handle
  }
}

export async function GetUserWeekCalendar(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  const now = new Date();
  const startDateTime = zonedTimeToUtc(startOfWeek(now), timeZone).toISOString();
  const endDateTime = zonedTimeToUtc(endOfWeek(now), timeZone).toISOString();
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/calendarview?startdatetime=2024-04-16T02:23:30.488Z&enddatetime=2024-04-23T02:23:30.488Z`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp
}
export async function GetEmails(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetEmailList(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetEmailById(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetEmailById2(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetFolders(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetTrash(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetTrashList(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetJunk(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetJunkList(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetInbox(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetInboxList(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetDrafts(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/drafts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetDraftsList(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/drafts/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetList(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function TestInbox(accessToken) {
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GetAllFolders(accessToken) {
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/?includeHiddenFolders=true`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function DeleteMessage(accessToken) {
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages/${id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function CreateMailFolder(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/mailFolders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function MessageRead(accessToken) {
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function MessageUnRead(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function MessageDone(accessToken) {
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages/${id}/move`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function ReplyMessage(accessToken) {
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages/${id}/reply`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function ReplyAllEmail(accessToken) {
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages/${id}/reply`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function CreatetestFolder(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/${id}/childFolders`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function GettestFolderList(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`/me/mailFolders/${id}/messages`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function forwardEmail(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages/${id}/forward`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function listAttachment(accessToken) {
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/messages/${id}/attachments`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function composeEmail(accessToken) {
  // this needs a time frame to be inputed into the http requiest
  let httpResp;
  await fetch(`https://graph.microsoft.com/v1.0/me/sendMail`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => {
      httpResp = response.json()
      response.json()
    }
    )
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  return httpResp

}
export async function Unauthorized(refreshToken, session) {
  console.log('Unauthorized');
  const newAccessToken = getAccessToken(refreshToken)
  console.log(newAccessToken, 'newAccessToken', refreshToken, 'refreshToken')
  let accessToken = session.get("accessToken")
  await commitSession(accessToken);

  const tokens = newAccessToken
  return json({ user, email, tokens },
    { headers: { "Set-Cookie": await commitSession(session), }, });
}
const getAccessToken = async (refreshToken) => {
  try {
    const accessTokenObj = await axios.post(
      'https://www.googleapis.com/oauth2/v4/token',
      {
        refresh_token: refreshToken,
        client_id: "286626015732-f4db11irl7g5iaqb968umrv2f1o2r2rj.apps.googleusercontent.com",
        client_secret: "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",
        grant_type: 'refresh_token'
      }
    );

    return accessTokenObj.data.access_token;
  } catch (err) {
    console.log(err);
  }
};
