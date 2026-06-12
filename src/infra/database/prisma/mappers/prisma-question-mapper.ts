import { UniqueEntityID } from "../../../../../dist/src/core/entities/unique-entity-id";
import { Question } from "../../../../../dist/src/domain/forum/enterprise/entities/question";
import { Question as PrismaQuestion } from "@prisma/client";
import { Slug } from "../../../../../dist/src/domain/forum/enterprise/entities/value-objects/slug";


export class PrismaQuestionMapper {
    static toDomain(raw: PrismaQuestion): Question {
        return Question.create({
            title: raw.title,
            content: raw.content,
            authorId: new UniqueEntityID(raw.authorId),
            bestAnswerId: raw.bestAnswerId
            ? new UniqueEntityID(raw.bestAnswerId)
            : undefined,
            slug: Slug.create(raw.slug),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt ?? undefined,
        }, new UniqueEntityID(raw.id));
    }
}