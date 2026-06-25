import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Attachment as PrismaAttachment, } from "@prisma/client";
import { QuestionAttachment } from "../../../../../src/domain/forum/enterprise/entities/question-attachment";


export class PrismaQuestionAttachmentMapper {
    static toDomain(raw: PrismaAttachment): QuestionAttachment {
        if(!raw.questionId) {
            throw new Error("Invalid attachment type.");
        }

        return QuestionAttachment.create({
            questionId: new UniqueEntityID(raw.questionId),
            attachmentId: new UniqueEntityID(raw.id),
        }, new UniqueEntityID(raw.id));
    }
}