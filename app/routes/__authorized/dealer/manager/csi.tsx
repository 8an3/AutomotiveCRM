// Import necessary modules
import { Form } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import { type ActionFunction } from '@remix-run/node'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input, Button, Label } from '~/components';
import { prisma } from '~/libs';
import { FaPlus } from "react-icons/fa";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

export const action = async ({ request }: { request: Request }) => {
  const formPayload = Object.fromEntries(await request.formData());
  try {
    for (const key in formPayload) {
      if (Object.prototype.hasOwnProperty.call(formPayload, key)) {
        const [departmentName, departmentIndexStr, questionIndexStr, field] = key.split(/[\[\]]+/);

        const departmentIndex = parseInt(departmentIndexStr, 10);
        const questionIndex = parseInt(questionIndexStr, 10);

        if (!isNaN(departmentIndex) && !isNaN(questionIndex)) {
          const data = {
            title: formPayload.title,
            departmentName,
            departmentIndex,
            questionIndex,
            question: undefined,
            answerFormat: undefined,
            customMultipleChoiceAnswer: undefined,
            customMultipleChoiceAnswers: undefined,
          };

          if (field === 'question') {
            data.question = formPayload[key];
          } else if (field === 'answerFormat') {
            data.answerFormat = formPayload[key];
          } else if (field === 'customMultipleChoiceAnswer') {
            data.customMultipleChoiceAnswer = formPayload[key];
          } else if (field === 'customMultipleChoiceAnswers') {
            data.customMultipleChoiceAnswers = formPayload[key].split(',');
          }

          // Use Prisma to create a CsiQuestion record
          await prisma.csiQuestion.create({
            data,
          });
        }
      }
    }

    console.log('Form data saved successfully!');
  } catch (error) {
    console.error('Error saving form data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }

  console.log(formPayload);
  return null;
};


export default function SettingsAccountPage() {
  return (
    <div className="space-y-6 space-x-6 mx-10 ml-[100px] text-white">
      <div>
        <h3 className="text-lg font-medium">CSI</h3>
        <p className="text-sm text-white">
          Create your own CSI to see where your dealer needs to improve.
        </p>
      </div>
      <hr className="solid text-white" />
      <Tabs defaultValue="account" className="w-[50%]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Create</TabsTrigger>
          <TabsTrigger value="password">Manage</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Create CSI</CardTitle>

            </CardHeader>
            <CardContent className="space-y-2">
              <CSI />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Manage CSI Questionaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}



export function CSI() {
  const departments = ['Sales', 'Service Dept.', 'Accessory Dept', 'Management'];
  const initialInputs = departments.map(() => []);
  const [inputs, setInputs] = useState(initialInputs);
  const [title, setTitle] = useState('');

  const handleInputChange = (departmentIndex, inputIndex, field, value) => {

    const updatedInputs = [...inputs];
    updatedInputs[departmentIndex][inputIndex] = {
      ...updatedInputs[departmentIndex][inputIndex],
      [field]: value
    };
    setInputs(updatedInputs);
  };

  const handleAddCustomChoice = (departmentIndex, inputIndex) => {

    const updatedInputs = [...inputs];
    const customChoice = window.prompt('Enter custom choice:');
    if (customChoice) {
      updatedInputs[departmentIndex][inputIndex].customMultipleChoiceAnswers.push(customChoice);
      setInputs(updatedInputs);
    }
  };

  const handleAddInput = (departmentIndex) => {
    const updatedInputs = [...inputs];
    updatedInputs[departmentIndex].push({ question: '', answerFormat: '', customMultipleChoiceAnswers: [] });
    setInputs(updatedInputs);
  };

  return (
    <div>
      <p>CSI Title</p>
      <Input
        name='title'
        onChange={(e) => setTitle(e.target.value)}
        className='w-auto'
      />
      {departments.map((department, departmentIndex) => (
        <div key={departmentIndex}>
          <h2>{department}</h2>
          {inputs[departmentIndex].map((input, inputIndex) => (
            <div key={inputIndex} className=' '>
              <div key={inputIndex} className='flex content-center items-center'>

                <Input
                  type="text"
                  defaultValue={input.question}
                  onChange={(e) => handleInputChange(departmentIndex, inputIndex, 'question', e.target.value)}
                  placeholder="Question"
                  className="  text-black bg-white mr-3 w-auto"

                />
                <select
                  defaultValue={input.answerFormat}
                  onChange={(e) => handleInputChange(departmentIndex, inputIndex, 'answerFormat', e.target.value)}
                  className="text-black bg-white mr-3 p-1 rounded-md"

                >
                  <option value="">Select answer format</option>
                  <option value="Input">Input</option>
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Custom Multiple Choice">Custom Multiple Choice</option>
                </select>
                {input.answerFormat === 'Custom Multiple Choice' && (
                  <button onClick={() => handleAddCustomChoice(departmentIndex, inputIndex)}><FaPlus /></button>
                )}
              </div>

              {input.customMultipleChoiceAnswers.map((choice, choiceIndex) => (
                <div key={choiceIndex}>
                  <Input
                    type="text"
                    defaultValue={choice}
                    className="text-black bg-white w-auto ml-[200px]"

                    onChange={(e) => {
                      const updatedChoices = [...input.customMultipleChoiceAnswers];
                      updatedChoices[choiceIndex] = e.target.value;
                      const updatedInputs = [...inputs];
                      updatedInputs[departmentIndex][inputIndex].customMultipleChoiceAnswers = updatedChoices;
                      setInputs(updatedInputs);
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
          <button onClick={() => handleAddInput(departmentIndex)}><FaPlus /></button>
        </div>
      ))}
      <Form method='post'>
        <input type='hidden' name='title' value={title} />

        {departments.map((departments, departmentIndex) => (
          <div key={departmentIndex}>
            {inputs[departmentIndex].map((input, inputIndex) => (
              <div key={inputIndex} className=' '>
                <input type='hidden' name={`${departments}[question]`} value={input.question} />
                <input type='hidden' name={`${departments}[answerFormat]`} value={input.answerFormat} />
                <input type='hidden' name={`${departments}[customMultipleChoiceAnswers]`} value={input.customMultipleChoiceAnswers.join(',')} />
              </div>
            ))}
          </div>
        ))}
        <Button
          variant='ghost'
          type='submit'
          className='text-white bg-transparent hover:bg-transparent border-white'
        >
          Save
        </Button>
      </Form>
      <ReviewTable inputs={inputs} departments={departments} />
    </div>
  );
}
/**
export function CSI() {
  const departments = ['Sales', 'Service Dept.', 'Accessory Dept', 'Management'];
  const initialInputs = departments.map(() => []);
  const [inputs, setInputs] = useState(initialInputs);

  const handleInputChange = (departmentIndex, inputIndex, field, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[departmentIndex][inputIndex] = {
      ...updatedInputs[departmentIndex][inputIndex],
      [field]: value
    };
    setInputs(updatedInputs);
  };

  const handleAddInput = (departmentIndex) => {
    const updatedInputs = [...inputs];
    updatedInputs[departmentIndex].push({ question: '', answerFormat: '' });
    setInputs(updatedInputs);
  };

  return (
    <div>
      {departments.map((department, departmentIndex) => (
        <div key={departmentIndex} className=' '>
          <h2>{department}</h2>
          <hr className='text-white mb-2 mt-1 w-[50%]' />
          {inputs[departmentIndex].map((input, inputIndex) => (
            <div key={inputIndex} className='flex space-y-4 items-center align-middle content-center'>
              <Input
                type="text"
                value={input.question}
                className='text-black border p-2 w-auto mr-3 my-auto bg-white'
                onChange={(e) => handleInputChange(departmentIndex, inputIndex, 'question', e.target.value)}
              />
              <select
                value={input.answerFormat}
                className='text-black border p-2 w-auto mr-3 my-auto bg-white rounded-md'
                onChange={(e) => handleInputChange(departmentIndex, inputIndex, 'answerFormat', e.target.value)}
              >
                <option value="">Select answer format</option>
                <option value="Input">Input</option>
                <option value="Multiple Choice">Multiple Choice</option>
                <option value="Custom Multiple Choice">Custom Multiple Choice</option>
              </select>
            </div>
          ))}
          <button onClick={() => handleAddInput(departmentIndex)}><FaPlus />
          </button>
        </div>
      ))}
      <ReviewTable inputs={inputs} departments={departments} />
    </div>
  );
};
*/
const ReviewTable = ({ inputs, departments }) => {
  return (
    <div className='mt-10'>
      <h2>Review</h2>
      <table className='border border-white rounded-md'>
        <thead className='border-b border-white'>
          <tr>
            <th className='mr-3 p-3'>Department</th>
            <th className='mr-3 p-3'>Question</th>
            <th className='mr-3 p-3'>Answer Format</th>
          </tr>
        </thead>
        <tbody>
          {inputs.map((departmentInputs, departmentIndex) =>
            departmentInputs.map((input, inputIndex) => {
              // Determine if the answer format is 'Custom Multiple Choice'
              const isCustomMultipleChoice = input.answerFormat.toLowerCase() === 'custom multiple choice';

              // Render the main row for the input
              return (
                <tr className='' key={`${departmentIndex}-${inputIndex}`}>
                  {inputIndex === 0 && (
                    <td className='mr-3 p-3 border-r border-white' rowSpan={departmentInputs.length}>
                      {departments[departmentIndex]}
                    </td>
                  )}
                  <td className='mr-3 p-3 border-r border-white'>{input.question}</td>
                  <td className='mr-3 p-3'>
                    {input.answerFormat}
                    {/* Render custom multiple choice answers if applicable */}
                    {isCustomMultipleChoice && input.customMultipleChoiceAnswers.length > 0 && (
                      <ul className="list-disc pl-5">
                        {input.customMultipleChoiceAnswers.map((choice, choiceIndex) => (
                          <li key={`${departmentIndex}-${inputIndex}-choice-${choiceIndex}`}>{choice}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>



  );
};


// need to add custom multiple choice
/**
 *
 *
 * export function CSI() {
  const departments = ['Sales', 'Service Dept.', 'Accessory Dept', 'Management'];
  const initialInputs = departments.map(() => [{ question: '', answerFormat: '', customMultipleChoiceAnswer: '', customMultipleChoiceAnswers: [] }]);
  const [inputs, setInputs] = useState(initialInputs);
  const [inputsData, setInputsData] = useState(inputs);
  //JSON.stringify(inputs)

  // Function to handle input change
  const handleInputChange = (departmentIndex, inputIndex, event) => {
    const { name, value } = event.target;
    const newInputs = [...inputs];
    newInputs[departmentIndex][inputIndex] = { ...newInputs[departmentIndex][inputIndex], [name]: value };
    const isCustomMultiChoice = value.toLowerCase().includes('custommultichoice');

    setInputs(newInputs);
  };


  const handleAddCustomChoice = (departmentIndex, inputIndex, choice) => {
    const newInputs = [...inputs];
    newInputs[departmentIndex][inputIndex].customMultipleChoiceAnswers.push(choice);
    setInputs(newInputs);
  };

  const handleAddInput = (departmentIndex) => {
    const newInputs = [...inputs];
    newInputs[departmentIndex].push({ question: '', answerFormat: '', customMultipleChoiceAnswer: '', customMultipleChoiceAnswers: [] });
    setInputs(newInputs);
  };

  function containsCustomMultiChoice(inputString) {
    const regex = /customMultiChoice/i; // 'i' flag makes the search case-insensitive
    return regex.test(inputString);
  }
  const inputData = inputs
  const input2 = "Some other string";
  const containsCustom = containsCustomMultiChoice(inputData);
  console.log(containsCustom, inputs);

  useEffect(() => {
    try {
      const parsedInputs = JSON.parse(inputs);
      setInputs(parsedInputs);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }, []); // Run once on component mount

  return (
    <>
      <Form method="post" className='w-[95%]'>
        {inputs.map((departmentInputs, departmentIndex) => (
          <div key={departmentIndex} className='mt-3'>
            <h1>{departments[departmentIndex]}</h1>
            <div className="space-y-4">
              {departmentInputs.map((input, inputIndex) => (
                <div key={inputIndex} className="flex items-center space-x-4">
                  <input
                    type="text"
                    name={`inputs.${departmentIndex}[${inputIndex}].question`}
                    defaultValue={input.question}
                    onChange={(e) => handleInputChange(departmentIndex, inputIndex, e)}
                    placeholder="Question"
                    className="border p-2 w-auto"
                  />
                  <select
                    name={`inputs.${departmentIndex}[${inputIndex}].answerFormat`}
                    defaultValue={input.answerFormat}
                    onChange={(e) => handleInputChange(departmentIndex, inputIndex, e,)}
                    className="w-auto border p-2 "
                  >
                    <option value="">Select answer format</option>
                    <option value="input">Input</option>
                    <option value="multichoice">Satisfactory Multiple Choice</option>
                    <option value="customMultichoice">Custom Multiple Choice</option>
                  </select>
                  {inputIndex === departmentInputs.length - 1 && (
                    <Button
                      type="button"
                      onClick={() => handleAddInput(departmentIndex)}
                      className="text-white px-3 py-2 rounded bg-blue-500 hover:bg-blue-600"
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <Button type="submit" className="text-white px-3 py-2 mt-4 rounded bg-green-500 hover:bg-green-600">
          Submit
        </Button>
      </Form>
      {inputs ? (
        <>
          <div>
            <p>{JSON.stringify(inputs)}</p>
          </div>

        </>
      ) : (
        <p>No idTokenClaims available</p>
      )}
      {inputs ? (
        <div>
          <ReviewTable inputs={inputs} />
        </div>
      ) : (
        <p>No inputs available</p>
      )}



    </>

  );
}



{input.answerFormat === 'customMultichoice' && (
                  <>
                    <Input
                      type="text"
                      name={`inputs.${departmentIndex}[${inputIndex}].customMultipleChoiceAnswer`}
                      defaultValue={input.customMultipleChoiceAnswer}
                      onChange={(e) => handleInputChange(departmentIndex, inputIndex, e)}
                      placeholder="Custom Multiple Choice Options (comma-separated)"
                      className="border p-2"
                    />
                    <Button
                      onClick={() => handleAddCustomChoice(departmentIndex, inputIndex, input.customMultipleChoiceAnswer)}
                      className="text-white px-3 py-2 rounded bg-blue-500 hover:bg-blue-600"
                    >
                      Add Choice
                    </Button>
                    <ul>
                      {input.customMultipleChoiceAnswers.map((choice, choiceIndex) => (
                        <li key={choiceIndex}>{choice}</li>
                      ))}
                    </ul>
                  </>
                )} */
