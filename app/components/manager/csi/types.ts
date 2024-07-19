export interface RenderedItem {
  id: string;
  title: string;
  order: number;
  content: string | null;
  columnId: string;
}

export const CONTENT_TYPES = {
  card: "application/remix-card",
  column: "application/remix-column",
  cardData: "application/remix-cardData",
};

export const INTENTS = {
  createColumn: "newColumn" as const,
  updateColumn: "updateColumn" as const,
  createItem: "createItem" as const,
  moveItem: "moveItem" as const,
  moveColumn: "moveColumn" as const,
  updateBoardName: "updateBoardName" as const,
  deleteBoard: "deleteBoard" as const,
  createBoard: "createBoard" as const,
  deleteCard: "deleteCard" as const,
  updateCsiName: "updateCsiName" as const,
  createAnswer: "createAnswer" as const,
  createAnswerData: "createAnswerData" as const,
  createQuestion: "createQuestion" as const,
  updateQuestion: "updateQuestion" as const,
  deleteAnswer: "deleteAnswer" as const,
  deleteAnswerData: "createAnswerData" as const,
  deleteQuestion: "deleteQuestion" as const,
  deleteCsi: "deleteCsi" as const,
  updateAnswer: "createAnswer" as const,
  updateAnswerData: "createAnswerData" as const,
  moveAnswer: "moveAnswer" as const,
  moveAnswerData: "moveAnswer" as const,
};

export const ItemMutationFields = {
  id: { type: String, name: "id" },
  columnId: { type: String, name: "columnId" },
  order: { type: Number, name: "order" },
  title: { type: String, name: "title" },
  content: { type: String, name: "content" },
  questionId: { type: String, name: "questionId" },
  answerId: { type: String, name: "answerId" },
  answerDataId: { type: String, name: "answerDataId" },
  csiId: { type: String, name: "csiId" },
} as const;

export type ItemMutation = MutationFromFields<typeof ItemMutationFields>;

////////////////////////////////////////////////////////////////////////////////
// Bonkers TypeScript
type ConstructorToType<T> = T extends typeof String
  ? string
  : T extends typeof Number
  ? number
  : never;

export type MutationFromFields<T extends Record<string, any>> = {
  [K in keyof T]: ConstructorToType<T[K]["type"]>;
};
