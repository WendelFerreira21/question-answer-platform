import { Injectable } from "@nestjs/common";
import { AnswerCommentsRepository } from "../../../../../dist/src/domain/forum/application/repositories/answer-comments-repository";
import { PaginationParams } from "../../../../../dist/src/core/repositories/pagination-params";
import { AnswerComment } from "../../../../../dist/src/domain/forum/enterprise/entities/answer-comment";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
    findById(id: string): Promise<AnswerComment | null> {
        throw new Error("Method not implemented.");
    }
    findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]> {
        throw new Error("Method not implemented.");
    }
    create(answerComment: AnswerComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(answerComment: AnswerComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
}