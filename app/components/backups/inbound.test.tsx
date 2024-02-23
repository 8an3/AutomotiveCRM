export default async function sdfsdfsdfs() {
  const apitest = await fetch('http://localhost:3000/leads/inbound/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'Heritage Softtail',
      firstName: 'Franco',
      lastName: 'Franco',
      email: 'testrestdf@example.com',
      phone: '123-456-7891',
      address: '123 Main St',
      leadNote: 'interested in the 2024 night rod',
      city: 'test',
      postal: 'test',
      province: 'test',
      dl: 'test',
      typeOfContact: 'test',
      timeToContact: 'test',
      deposit: '500',
      desiredPayments: '400',
      stockNum: 'test',
      options: 'test',

      year: '2022',
      brand: 'HD',
      model1: 'Heritage Softtail',
      color: 'black',
      modelCode: 'none',
      msrp: '19999',
      userEmail: 'test',
      tradeValue: 'test',
      tradeDesc: 'M90',
      tradeColor: 'black',
      tradeYear: '2018',
      tradeMake: 'suzuki',
      tradeVin: 'test',
      tradeTrim: 'm90',
      tradeMileage: '15000',
      trim: 'test',
      vin: 'test',
    }),
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });

  return apitest
}
