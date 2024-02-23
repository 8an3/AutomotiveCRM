import { prisma } from "~/libs";


export async function getScriptsListItems() {
  try {
    const scriptList = await prisma.script.findMany({
      // Assuming your table is named "script"
      select: { id: true, content: true, email: true, category: true, subCat: true, }, // Adjust the properties you want to select
      orderBy: { createdAt: 'desc' },
    })
    return scriptList
  } catch (error) {
    console.error('Error retrieving script list items:', error)
    throw new Error('Failed to retrieve script list items')
  }
}



// --- Overcomes --- \\
export async function getOvercomes() {
  try {
    const closes = await prisma.script.findMany({
      where: { category: { contains: 'overcome' } }
    })
    return closes
  } catch (error) {
    console.error('Error retrieving latest finance:', error)
    throw new Error('Failed to retrieve latest quote')
  }
}

// --- FollowUp --- \\
export async function getFollowUp() {
  try {
    const closes = await prisma.script.findMany({
      where: { category: { contains: 'followups' } }
    })
    return closes
  } catch (error) {
    console.error('Error retrieving latest finance:', error)
    throw new Error('Failed to retrieve latest quote')
  }
}
// --- Qualifying --- \\
export async function getQualifying() {
  try {
    const closes = await prisma.script.findMany({
      where: { category: { contains: 'Qualifying' } }
    })
    return closes
  } catch (error) {
    console.error('Error retrieving latest finance:', error)
    throw new Error('Failed to retrieve latest quote')
  }
}

// --- Texting --- \\
export async function getTexting() {
  try {
    const closes = await prisma.script.findMany({
      where: { category: { contains: 'Text Messages' } }
    })
    return closes
  } catch (error) {
    console.error('Error retrieving latest finance:', error)
    throw new Error('Failed to retrieve latest quote')
  }
}

// --- Stories --- \\
export async function getStories() {
  try {
    const closes = await prisma.script.findMany({
      where: { category: { contains: 'Stories' } }
    })
    return closes
  } catch (error) {
    console.error('Error retrieving latest finance:', error)
    throw new Error('Failed to retrieve latest quote')
  }
}



// --- Closes --- \\
export async function getCloses() {
  try {
    const closes = await prisma.script.findMany({
      where: { category: { contains: 'closes' } }
    })
    return closes
  } catch (error) {
    console.error('Error retrieving latest finance:', error)
    throw new Error('Failed to retrieve latest quote')
  }
}

export async function directClose() {
  try {
    const directCloseRecord = await prisma.script.findMany({
      where: {
        category: 'closes',
        subCat: 'directs',
      },
    });
    return directCloseRecord;
  } catch (error) {
    console.error('Error retrieving direct close record:', error);
    throw new Error('Failed to retrieve direct close record');
  } finally {
    await prisma.$disconnect(); // Disconnect from the database client when done
  }
}

export async function assumptiveClose() {
  try {
    const assumptive = await prisma.script.findMany({
      where: {
        category: 'closes',
        subCat: 'assumptive',
      },
    });
    return assumptive;
  } catch (error) {
    console.error('Error retrieving direct close record:', error);
    throw new Error('Failed to retrieve direct close record');
  } finally {
    await prisma.$disconnect(); // Disconnect from the database client when done
  }
}

export async function alternativeClose() {
  try {
    const assumptive = await prisma.script.findMany({
      where: {
        category: 'closes',
        subCat: 'alternative',
      },
    });
    return assumptive;
  } catch (error) {
    console.error('Error retrieving direct close record:', error);
    throw new Error('Failed to retrieve direct close record');
  } finally {
    await prisma.$disconnect(); // Disconnect from the database client when done
  }
}


export async function problemSolvingClose() {
  try {
    const assumptive = await prisma.script.findMany({
      where: {
        category: 'closes',
        subCat: 'problem',
      },
    });
    return assumptive;
  } catch (error) {
    console.error('Error retrieving direct close record:', error);
    throw new Error('Failed to retrieve direct close record');
  } finally {
    await prisma.$disconnect(); // Disconnect from the database client when done
  }
}

export async function feltClose() {
  try {
    const assumptive = await prisma.script.findMany({
      where: {
        category: 'closes',
        subCat: 'felt',
      },
    });
    return assumptive;
  } catch (error) {
    console.error('Error retrieving direct close record:', error);
    throw new Error('Failed to retrieve direct close record');
  } finally {
    await prisma.$disconnect(); // Disconnect from the database client when done
  }
}
export async function emotionalClose() {
  try {
    const assumptive = await prisma.script.findMany({
      where: {
        category: 'closes',
        subCat: 'emotional',
      },
    });
    return assumptive;
  } catch (error) {
    console.error('Error retrieving direct close record:', error);
    throw new Error('Failed to retrieve direct close record');
  } finally {
    await prisma.$disconnect(); // Disconnect from the database client when done
  }
}

export async function testDriveClose() {
  try {
    const assumptive = await prisma.script.findMany({
      where: {
        category: 'closes',
        subCat: 'testDrives',
      },
    });
    return assumptive;
  } catch (error) {
    console.error('Error retrieving direct close record:', error);
    throw new Error('Failed to retrieve direct close record');
  } finally {
    await prisma.$disconnect(); // Disconnect from the database client when done
  }
}

export async function questionClose() {
  try {
    const assumptive = await prisma.script.findMany({
      where: {
        category: 'closes',
        subCat: 'question',
      },
    });
    return assumptive;
  } catch (error) {
    console.error('Error retrieving direct close record:', error);
    throw new Error('Failed to retrieve direct close record');
  } finally {
    await prisma.$disconnect(); // Disconnect from the database client when done
  }
}
export async function summaryClose() {
  try {
    const assumptive = await prisma.script.findMany({
      where: {
        category: 'closes',
        subCat: 'summary',
      },
    });
    return assumptive;
  } catch (error) {
    console.error('Error retrieving direct close record:', error);
    throw new Error('Failed to retrieve direct close record');
  } finally {
    await prisma.$disconnect(); // Disconnect from the database client when done
  }
}
export async function trialClose() {
  try {
    const assumptive = await prisma.script.findMany({
      where: {
        category: 'closes',
        subCat: 'trial',
      },
    });
    return assumptive;
  } catch (error) {
    console.error('Error retrieving direct close record:', error);
    throw new Error('Failed to retrieve direct close record');
  } finally {
    await prisma.$disconnect(); // Disconnect from the database client when done
  }
}

export async function upSellClose() {
  try {
    const assumptive = await prisma.script.findMany({
      where: {
        category: 'closes',
        subCat: 'upsell',
      },
    });
    return assumptive;
  } catch (error) {
    console.error('Error retrieving direct close record:', error);
    throw new Error('Failed to retrieve direct close record');
  } finally {
    await prisma.$disconnect(); // Disconnect from the database client when done
  }
}

export async function getLatestScripts() {
  try {
    const latestSuggestions = await prisma.script.findFirst({

      where: {
        category: { contains: 'new' }
      },
      orderBy: { createdAt: 'desc' },
    })
    return latestSuggestions
  } catch (error) {
    console.error('Error retrieving latest finance:', error)
    throw new Error('Failed to retrieve latest quote')
  }
}
