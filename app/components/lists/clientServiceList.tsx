export function ClientServiceFunction({ formData, }) {

  let clientResultList = [
    { name: 'booked', value: formData.serviceState, label: 'booked', },
    { name: 'partsOrder', value: formData.serviceState, label: 'waitingOnParts', },
    { name: 'waitingForClientApproval', value: formData.serviceState, label: 'waitingOnParts', },
    { name: 'waitingOnParts', value: formData.serviceState, label: 'waitingOnParts', },
    { name: 'inMechanicsBay', value: formData.serviceState, label: 'Booked Apt', },
    { name: 'readyToBeWashed', value: formData.serviceState, label: 'Apt Showed', },
    { name: 'readyToBePU', value: formData.serviceState, label: 'Apt No Showed', },

  ];

  return clientResultList
}


