import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Comment as PrismaComment, Prisma } from "@prisma/client";
import { QuestionComment } from "../../../../../src/domain/forum/enterprise/entities/question-comment";


export class PrismaQuestionCommentMapper {
    static toDomain(raw: PrismaComment): QuestionComment {
        if(!raw.questionId) {
            throw new Error("Invalid comment type.");
        }

        return QuestionComment.create({
            content: raw.content,
            questionId: new UniqueEntityID(raw.questionId),
            authorId: new UniqueEntityID(raw.authorId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt ?? undefined,
        }, new UniqueEntityID(raw.id));
    }

    static toPrisma(questionComment: QuestionComment): Prisma.CommentUncheckedCreateInput {
        return {
            id: questionComment.id.toString(),
            questionId: questionComment.questionId.toString(),
            authorId: questionComment.authorId.toString(),
            content: questionComment.content,
            createdAt: questionComment.createdAt,
            updatedAt: questionComment.updatedAt ?? null,
        }
    }
}