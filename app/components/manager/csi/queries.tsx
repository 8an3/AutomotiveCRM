import { prisma } from "~/libs/prisma.server";

import { ItemMutation } from "./types";

export function deleteCard(id: string, userId: string) {
  return prisma.item.delete({ where: { id } });
}

export async function getBoardData(boardId: string) {
  return prisma.board.findUnique({
    where: {
      id: boardId,
    },
    include: {
      items: true,
      columns: { orderBy: { order: "asc" } },
    },
  });
}

export async function updateBoardName(
  boardId: number,
  name: string,
  userId: string,
) {

}

export function upsertItem(
  mutation: ItemMutation & { boardId: string },
  userId: string,
) {
  return prisma.item.upsert({
    where: {
      id: mutation.id,
    },
    create: {
      ...mutation,
      boardId: mutation.boardId,
    },
    update: {
      ...mutation,
      boardId: mutation.boardId,
    },
  });
}



export async function updateColumnName(
  id: string,
  name: string,
  userId: string,
) {
  return prisma.column.update({
    where: { id },
    data: { name },
  });
}

export async function createColumn(
  boardId: string,
  name: string,
  id: string,
  userId: string,
) {
  let columnCount = await prisma.column.count({
    where: { boardId, Board: { userId } },
  });
  return prisma.column.create({
    data: {
      id,
      boardId,
      name,
      order: columnCount + 1,
    },
  });
}


export async function deleteBoard(boardId: string, userId: string) {
  return prisma.board.delete({
    where: { id: boardId },
  });
}

export async function createBoard(userId: string, name: string, color: string) {
  return prisma.board.create({
    data: {
      name,
      color,
      userId,
    },
  });
}

export async function getHomeData(email: string) {
  return prisma.board.findMany({
    where: {
      userEmail: email,
    },
  });
}
