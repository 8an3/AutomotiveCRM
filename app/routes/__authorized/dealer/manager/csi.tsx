// Import necessary modules
import { Form } from '@remix-run/react';
import { useState } from 'react';
import { type ActionFunction } from '@remix-run/node'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input, Button } from '~/components';

export async function action({ params, request }: ActionFunction) {

  return null
}

export default function CSI() {
  const departments = ['Sales', 'Service Dept.', 'Accessory Dept', 'Management'];
  const initialInputs = departments.map(() => [{ question: '', answerFormat: '', customMultipleChoiceAnswer: '', customMultipleChoiceAnswers: [] }]);
  const [inputs, setInputs] = useState(initialInputs);
  const [inputsData, setInputsData] = useState();


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
                  {input ? (
                    <>
                      <div>
                        <p>inputs</p>
                        <p>{JSON.stringify(inputs)}</p>
                      </div>
                      {containsCustom === true ? (
                        <p>true   {containsCustom}</p>
                      ) : (

                        <p>false    {containsCustom}</p>
                      )}
                      <div>
                        <p>input</p>
                        <p>{JSON.stringify(input)}</p>
                      </div>
                    </>
                  ) : (
                    <p>No idTokenClaims available</p>
                  )}

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
                  )}
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
    </>

  );
}
