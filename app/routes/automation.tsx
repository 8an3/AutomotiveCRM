import React, { useEffect, useState } from 'react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { prisma } from '~/libs';

export default function Automation() {
  const [tableName, setTableName] = useState('');
  const [columnName, setColumnName] = useState('');
  const [columns, setColumns] = useState([]);
  const [columnValues, setColumnValues] = useState([]);

  useEffect(() => {
    fetchColumns();
  }, []);

  const fetchColumns = async () => {
    try {
      const financeColumns = await getTableColumns('Finance');
      const dashboardColumns = await getTableColumns('Dashboard');
      const combinedColumns = [...financeColumns, ...dashboardColumns];
      setColumns(combinedColumns);
    } catch (error) {
      console.error('Error fetching columns:', error);
      // Handle error (e.g., show error message)
    }
  };

  const getTableColumns = async (tableName) => {
    try {
      const tableInfo = await prisma.$queryRaw`
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = ${tableName};
      `;
      const columns = tableInfo.map((info) => info.COLUMN_NAME);
      return columns;
    } catch (error) {
      console.error(`Error fetching columns for table '${tableName}':`, error);
      throw error;
    }
  };

  const fetchColumnValues = async () => {
    try {
      const response = await fetch(`/api/automation/columns/${columnName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch columns');
      }
      const data = await response.json();
      setColumnValues(data.columns.values);
    } catch (error) {
      console.error('Error fetching columnsvalues:', error);
      // Handle error (e.g., show error message)
    }
  };

  const handleColumnChange = (event) => {
    const selectedColumn = event.target.value;
    setColumnName(selectedColumn);
    // Fetch column values based on selected table and column
    fetchColumnValues(tableName, selectedColumn);
  };

  return (
    <>
      <h1 className='text-center'>Automation Set-Up</h1>
      <div className='flex justify-center'>
        <div>
          <Label>Title</Label>
          <Input name='title' className='' placeholder='Title' />
        </div>
        <div>
          <Label>When</Label>
          <select className='border-black text-black bg-white autofill:placeholder:text-text-black justify-start h-8 cursor-pointer rounded border px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]'>
            <option value=''>Select an option</option>
            <option value='Lead is Created'>Lead is Created</option>
            <option value='Lead is Updated'>Lead is Updated</option>
            <option value='Task/Event is Created'>Task/Event is Created</option>
            <option value='Task/Event is Updated'>Task/Event is Updated</option>
          </select>
        </div>
        <div>
          <Label>Trigger Field</Label>
          <select className='border-black text-black bg-white autofill:placeholder:text-text-black justify-start h-8 cursor-pointer rounded border px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]'>
            <option value=''>Select an option</option>
            <option value='All'>All</option>
            <option value='TASK / EVENT'>TASK / EVENT</option>
            <option value='Start'>Start</option>
            <option value='End'>End</option>
            <option value='Owner'>Owner</option>
            <option value='Type'>Type</option>
            <option value='Follow done / Showed / Delivered'>Follow done / Showed / Delivered</option>
            <option value='Confirmed'>Confirmed</option>
            <option value='Canceled'>Canceled</option>
            <option value='No Show'>No Show</option>
          </select>
        </div>
      </div>
      <h1 className='text-center mt-10'>Criteria</h1>
      <div className='flex justify-center'>
        <select
          className="border-black text-black bg-white h-8 cursor-pointer rounded border px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none"
          onClick={(event) => (
            handleColumnChange(event)
          )}
        >
          <option value="">Select an option</option>
          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
        <select className='border-black text-black bg-white autofill:placeholder:text-text-black justify-start h-8 cursor-pointer rounded border px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]'>
          <option value=''>Select an option</option>
          <option value='Is defined'>Is defined</option>
          <option value='Is not defined'>Is not defined</option>
          <option value='Is'>Is</option>
          <option value='Is not'>Is not</option>
        </select>
        <select
          className="border-black text-black bg-white h-8 cursor-pointer rounded border px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none"

        >
          <option value=""></option>
          {columnValues.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
        <select className='border-black text-black bg-white autofill:placeholder:text-text-black justify-start h-8 cursor-pointer rounded border px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]'>
          <option value=''>Select an option</option>
          <option value='AND'>AND</option>
          <option value='OR'>OR</option>

        </select>
      </div>
    </>
  );
}



