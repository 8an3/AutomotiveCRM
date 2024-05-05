// Import necessary modules
import { Form } from '@remix-run/react';
import React, { useState } from 'react';
import { type ActionFunction } from '@remix-run/node'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input, Button } from '~/components';
import { prisma } from '~/libs';


export const action = async ({ request }: { request: Request }) => {
  const inputs = Object.fromEntries(await request.formData())

  const questions = inputs.map((departmentInputs, departmentIndex) =>
    departmentInputs.map((input, inputIndex) => ({
      departmentIndex,
      inputIndex,
      question: input.question,
      answerFormat: input.answerFormat,
      customMultipleChoiceAnswer: input.customMultipleChoiceAnswer,
      customMultipleChoiceAnswers: input.customMultipleChoiceAnswers,
    }))
  );

  try {
    await prisma.csiQuestion.createMany({
      data: questions,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error saving questions:', error);

    return new Response(JSON.stringify({ success: false, error: 'Failed to save questions' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

export function CSI() {
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

  // need to add custom multiple choice
  /**    {input.answerFormat === 'customMultichoice' && (
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
          <h2>Review</h2>
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Question</th>
                <th>Answer Format</th>
              </tr>
            </thead>
            <tbody>
              {inputs.map((departmentInputs, departmentIndex) => (
                departmentInputs.map((input, inputIndex) => (
                  <tr key={`${departmentIndex}-${inputIndex}`}>
                    {inputIndex === 0 && (
                      <td rowSpan={departmentInputs.length}>{`Department ${departmentIndex + 1}`}</td>
                    )}
                    <td>{input.question}</td>
                    <td>{input.answerFormat}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No inputs available</p>
      )}



    </>

  );
}


export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">CSI</h3>
        <p className="text-sm text-muted-foreground">
          Create your own CSI to see where your dealer needs to improve.
        </p>
      </div>
      <hr className="solid text-white" />
      <CSI />
    </div>
  )
}
