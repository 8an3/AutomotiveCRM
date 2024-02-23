import { PrismaClient } from '@prisma/client';

/**
// functions/appointmentReminder.js
export const config = {
  runtime: 'edge',
};// functions/executeAutomation.js
 */
const prisma = new PrismaClient();

export async function handler(req, res) {
  try {
    // Fetch automation records from the database
    const automationRecords = await prisma.automation.findMany({ where: { completed: 'no' } });
    // this would usually pull all records to match it against the automation but for now, we will just use one
    const financeRecord = await prisma.user.findUnique({ where: { email: 'skylerzanth@gmail.com' } });
    const user = financeRecord
    // Iterate through records and execute automation if conditions are met
    for (const record of automationRecords) {
      if (shouldExecuteAutomation(record, financeRecord, user)) {
        executeAutomation(record);
      }
    }

    res.status(200).json({ message: 'Automation execution completed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function shouldExecuteAutomation(record, financeRecord, user) {
  const CheckTime = () => {
    const currentDate = new Date();
    const timeValue = parseInt(record.timeValue) // 22 for example
    const timeType = record.timeType // hours for exmaple
    const targetMonth = currentDate.getMonth() - timeValue;
    let targetYear = currentDate.getFullYear() + Math.floor(targetMonth / 12);
    const adjustedMonth = (targetMonth % 12 + 12) % 12;
    let secondDate = new Date();
    switch (timeType) {
      case 'minutes':
        secondDate = new Date(currentDate.getTime() - timeValue * 60 * 1000);
      case 'hours':
        secondDate = new Date(currentDate.getTime() - timeValue * 60 * 60 * 1000);
      case ('days'):
        secondDate = new Date(currentDate.getTime() - timeValue * 24 * 60 * 60 * 1000);
      case ('weeks'):
        secondDate = new Date(currentDate.getTime() - timeValue * 7 * 24 * 60 * 60 * 1000);
      case ('months'):
        secondDate = new Date(targetYear, adjustedMonth, currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds());
      case ('years'):
        targetYear = currentDate.getFullYear() - timeValue;
        secondDate = new Date(targetYear, currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds());
    }

    if (record.executeWhen === 'after') {
      secondDate > currentDate
      return true
    } else if (record.executeWhen === 'before') {
      secondDate < currentDate
      return true
    }
  }
  const CheckRecurrence = async () => {
    const recurrence = record.recurrance
    if (recurrence === 'No recurrance') {
      await prisma.automation.update({
        where: {
          id: record.id
        }, date: {
          completed: 'yes'
        }
      });
      return true
    }
    return false
  }
  const CheckCompleted = () => {
    switch (record.completed) {
      case ('yes'):
        return true
      case ('no'):
        return false
    }
  }
  const CheckexecutionSchedule = () => {
    switch (record.executionSchedule) {
      case ('alwaysSend'):
        return true
      case ('ifClosed'):
        return false
      case ('Execute at next open business hour'):
        return true
      case ('Only on chosen days'):
        return false
    }
  }
  const FuturePast = (variable, currentDate) => {
    if (record.executeWhen === 'after') {
      variable > currentDate
      return true
    } else if (record.executeWhen === 'before') {
      variable < currentDate
      return true
    }
    else {
      return false
    }
  }
  const currentDate = new Date();

  const userCriteria = [
    { column: 'status', condition: 'Is', value: 'Active', logicalOperator: 'AND' },
    { column: 'result', condition: 'Is', value: 'Reached', logicalOperator: 'AND' },
    { column: 'userEmail', condition: 'Is', value: 'skylerzanth@gmail.com', logicalOperator: 'AND' },
    { column: 'pickUpDate', condition: 'Is in the future', value: '', logicalOperator: 'AND' },
    { column: 'deliveredDate', condition: 'Is not defined', value: '', logicalOperator: '' },
    // Add more criteria as needed
  ];
  const lead = {
    Status: 'Active',
    AppointmentDate: '2024-01-20',
    Result: 'Reached',
    userEmail: 'skylerzanth@gmail.com',
    pickUpDate: '2024-01-23',
    deliveredDate: undefined,
    // ... other lead properties
  };
  function evaluateLeadAgainstCriteria(lead, userCriteria) {
    let meetsAllCriteria = true;

    for (const criterion of userCriteria) {
      const { column, condition, value } = criterion;

      const result = evaluateCriterion(lead[column], condition, value);

      // Combine results based on logical operator
      if (criterion.logicalOperator === 'AND') {
        meetsAllCriteria = meetsAllCriteria && result;
      } else if (criterion.logicalOperator === 'OR') {
        meetsAllCriteria = meetsAllCriteria || result;
      }
      // Add more logical operators if needed
    }

    return meetsAllCriteria;
  }


  function evaluateCriterion(leadValue, condition, criterionValue) {
    switch (condition) {
      case 'Is defined':
        return leadValue !== undefined && leadValue !== null;
      case 'Is not defined':
        return leadValue === undefined || leadValue === null;
      case 'Is':
        return leadValue === criterionValue;
      case 'Is not':
        return leadValue !== criterionValue;
      case 'Is before':
        return new Date(leadValue) < new Date(criterionValue);
      case 'Is after':
        return new Date(leadValue) > new Date(criterionValue);
      case 'Is in the past':
        return new Date(leadValue) < new Date();
      case 'Is in the future':
        return new Date(leadValue) > new Date();
      // Add more conditions as needed
      default:
        return false;
    }
  } const result = evaluateLeadAgainstCriteria(lead, userCriteria);
  console.log(result);
  return (result);
}

// Function to execute the automation
function executeAutomation(record) {
  // Implement your logic to execute the automation
  // Example: (replace with your actual communication or task creation)
  if (record.actions === 'email') {
    sendEmail(record);
  } else if (record.actions === 'sms') {
    sendSMS(record);
  } else if (record.actions === 'task') {
    createTask(record);
  }
}

// Implement functions for sending email, SMS, creating task, etc.
function sendEmail(record) {
  // Your logic to send email
  console.log('Sending email:', record.userEmail, record.when);
}

function sendSMS(record) {
  // Your logic to send SMS
  console.log('Sending SMS:', record.userEmail, record.when);
}

function createTask(record) {
  // Your logic to create a task
  console.log('Creating task:', record.userEmail, record.when);
}
