import React, { useEffect, useState } from 'react';
import { Email, columns } from "./email/columns"
import { DataTable } from "./email/data-table"

async function getData(): Promise<Email[]> {
  // Fetch data from your API here.
  return [
    {
      id: '1234',
      to: 'jesse@gmail.com',
      from: 'justin@gmail.com',
      review: 'good afternoon...',
      body: 'good afternoon what are you up to',
      date: 'Sun, Jan 06, 2626 03:66 PM',
      label: 'Inbox',
      attachment: '',
    },
    // ...
  ]
}


export default  function EmailClient() {
  const [data, setData] = useState<Email[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const emailData = await getData(); // Use your API function
        setData(emailData); // Set the resolved data
      } catch (error) {
        // Handle any errors
        console.error('Error fetching email data:', error);
      }
    }

    fetchData();
  }, []);
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-200 p-4">
        <ul className="space-y-2">
          <li><a href="#">Inbox</a></li>
          <li><a href="#">Sent</a></li>
          <li><a href="#">Drafts</a></li>
          {/* Add more folders or labels here */}
        </ul>
      </aside>
      <main className="flex-grow">
        {/* Your main content here */}
        <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
      </main>
    </div>
  );
}


