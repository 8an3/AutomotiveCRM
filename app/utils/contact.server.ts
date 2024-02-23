import { prisma } from "~/libs";

export function createSuggestions({ body, email }) {
	return prisma.suggestions.create({
		data: {
			body,
			email,
		},
	})
}


export async function getLatestSuggestions() {
    try {
        const latestSuggestions = await prisma.suggestions.findFirst({
            orderBy: { createdAt: 'desc' },
        })
        return latestSuggestions
    } catch (error) {
        console.error('Error retrieving latest finance:', error)
        throw new Error('Failed to retrieve latest quote')
    }
}

export async function deleteSuggestion({ id }) {
    return prisma.suggestions.delete({ where: { id: id } })
}
