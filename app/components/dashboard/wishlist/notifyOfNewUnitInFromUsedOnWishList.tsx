export async function NotifyWishList() {

  // wish list loader
  const wishList = await prisma.wishList.findMany({ where: { userId: user?.id }, })
  const inventory = await prisma.inventoryMotorcycle.findMany({
    select: { make: true, model: true, status: true, }
  })

  function calculateSimilarity(modelName1, modelName2, make) {
    let components1
    if (make === 'Harley-Davidson') {
      components1 = modelName1.split(' - ')[2].toLowerCase();
    } else {
      components1 = modelName1.split(' - ').map(component => component.toLowerCase());
    }
    const components2 = modelName2.split(' ')[0].toLowerCase()

    const multiSearchAtLeastN = (text, searchWords, minimumMatches) => (
      searchWords.some(word => text.includes(word) && --minimumMatches <= 0)
    );
    let name = modelName2.toLowerCase()
    let spl = name.split(' - ');
    let passed = multiSearchAtLeastN(modelName1.toLowerCase(), spl, 1);
    // console.log(name, modelName1.toLowerCase(), 'checking final verification ')
    //  console.log(passed);
    return passed
  }
  const filteredEmailsSet = new Set();

  // Assuming this function is marked as async
  async function processWishList() {
    for (const wishListItem of wishList) {
      for (const inventoryItem of inventory) {
        const similarityScore = calculateSimilarity(wishListItem.model, inventoryItem.model, inventoryItem.make);
        if (
          wishListItem.notified !== 'true' &&
          wishListItem.brand === inventoryItem.make &&
          similarityScore === true
          // && inventoryItem.status === 'available'
        ) {
          filteredEmailsSet.add(`${wishListItem.email} -- ${wishListItem.model}`);
          if (!wishListItem.notified) {
            await prisma.notificationsUser.create({
              data: {
                title: `Bike found for ${wishListItem.firstName} ${wishListItem.lastName}`,
                content: `${wishListItem.model} just came in - ${wishListItem.email} ${wishListItem.phone}`,
                read: 'false',
                type: 'updates',
                from: 'Wish List Update',
                userId: user?.id,
              }
            });
            await prisma.wishList.update({
              where: { id: wishListItem.id },
              data: { notified: 'true' }
            });
          }
        }
      }
    }
  }

  // Call the async function
  processWishList().then(() => {
    // Handle completion if needed
  }).catch(error => {
    console.error('Error processing wish list:', error);
  });
}
