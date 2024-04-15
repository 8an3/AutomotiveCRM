
export async function RetrieveCal(accessToken) {
  const request = await fetch('https://graph.microsoft.com/v1.0/me/calendar', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
      // Add any other headers as needed
    }
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

export async function RetrieveCalEvents(accessToken) {
  const request = await fetch('https://graph.microsoft.com/v1.0/me/calendar/events', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
      // Add any other headers as needed
    }
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}
export async function AddCalendarEvent(accessToken) {
  const request = await fetch('https://graph.microsoft.com/v1.0/me/calendar/events', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

}

export async function RetreiveCalendars(accessToken) {
  const request = await fetch('https://graph.microsoft.com/v1.0/me/calendars', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

}

export async function CreateCalendar(accessToken) {
  const request = await fetch('https://graph.microsoft.com/v1.0/me/calendars', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

}

export async function RetrieveEventsFromSpecCalendar(accessToken) {
  const request = await fetch('https://graph.microsoft.com/v1.0/me/calendars/{calendar-id}/events', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'Content-Type': 'application/json'
      // Add any other headers as needed
    },
    body: JSON.stringify({
      // Add your event data here
    })
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

}
