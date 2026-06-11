import { Injectable } from "@nestjs/common";
import { QuestionCommentsRepository } from "../../../../../dist/src/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "../../../../../dist/src/domain/forum/enterprise/entities/question-comment";

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
    findById(id: string): Promise<QuestionComment | null> {
        throw new Error("Method not implemented.");
    }
    findManyByQuestionId(questionId: string): Promise<QuestionComment[]> {
        throw new Error("Method not implemented.");
    }
    save(questionComment: QuestionComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
    create(questionComment: QuestionComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(questionComment: QuestionComment): Promise<void> {
        throw new Error("Method not implemented.");
    }
}