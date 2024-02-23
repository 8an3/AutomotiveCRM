export function ClientResultFunction({ formData, }) {

  let clientResultList = [
    { name: 'referral', value: formData.referral, label: 'Referral', },
    { name: 'visited', value: formData.visited, label: 'Visited', },
    { name: 'bookedApt', value: formData.bookedApt, label: 'Booked Apt', },
    { name: 'aptShowed', value: formData.aptShowed, label: 'Apt Showed', },
    { name: 'aptNoShowed', value: formData.aptNoShowed, label: 'Apt No Showed', },
    { name: 'testDrive', value: formData.testDrive, label: 'Test Drive', },
    { name: 'seenTrade', value: formData.seenTrade, label: 'Seen Trade', },
    { name: 'metService', value: formData.metService, label: 'Met Service', },
    { name: 'metManager', value: formData.metManager, label: 'Met Manager', },
    { name: 'metParts', value: formData.metParts, label: 'Met Parts', },
    { name: 'sold', value: formData.sold, label: 'Sold', },
    { name: 'depositMade', value: formData.depositMade, label: 'Deposit', },
    { name: 'refund', value: formData.refund, label: 'Refund', },
    { name: 'turnOver', value: formData.turnOver, label: 'Turn Over', },
    { name: 'financeApp', value: formData.financeApp, label: 'Finance Application', },
    { name: 'approved', value: formData.approved, label: 'approved', },
    { name: 'signed', value: formData.signed, label: 'Signed Docs', },
    { name: 'pickUpSet', value: formData.pickUpSet, label: 'Pick Up Date Set', },
    { name: 'demoed', value: formData.demoed, label: 'Demoed' },
    { name: 'delivered', value: formData.delivered, label: 'Delivered', },
  ];

  return clientResultList
}


export function ClientStateFunction() {

  let clientStateList = [
    { name: 'referral', value: 'Pending', label: 'Referral', },
    { name: 'visited', value: 'Reached', label: 'Visited', },
    { name: 'bookedApt', value: 'Reached', label: 'Booked Apt', },
    { name: 'aptShowed', value: 'Reached', label: 'Apt Showed', },
    { name: 'aptNoShowed', value: 'Reached', label: 'Apt No Showed', },
    { name: 'testDrive', value: 'Reached', label: 'Test Drive', },
    { name: 'seenTrade', value: 'Reached', label: 'Seen Trade', },
    { name: 'metService', value: 'Reached', label: 'Met Service', },
    { name: 'metManager', value: 'Reached', label: 'Met Manager', },
    { name: 'metParts', value: 'Reached', label: 'Met Parts', },
    { name: 'sold', value: 'Reached', label: 'Sold', },
    { name: 'depositMade', value: 'Reached', label: 'Deposit', },
    { name: 'refund', value: 'Reached', label: 'Refund', },
    { name: 'turnOver', value: 'Reached', label: 'Turn Over', },
    { name: 'financeApp', value: 'Reached', label: 'Finance Application', },
    { name: 'approved', value: 'Reached', label: 'approved', },
    { name: 'signed', value: 'Reached', label: 'Signed Docs', },
    { name: 'pickUpSet', value: 'Reached', label: 'Pick Up Date Set', },
    { name: 'demoed', value: 'Reached', label: 'Demoed' },
    { name: 'delivered', value: 'Reached', label: 'Delivered', },
  ];
  return clientStateList
}


