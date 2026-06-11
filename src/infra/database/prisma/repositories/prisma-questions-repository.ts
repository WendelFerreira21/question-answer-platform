import { Injectable } from "@nestjs/common";
import { QuestionsRepository } from "../../../../../dist/src/domain/forum/application/repositories/questions-repository";
import { PaginationParams } from "../../../../../dist/src/core/repositories/pagination-params";
import { Question } from "../../../../../dist/src/domain/forum/enterprise/entities/question";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
    findById(id: string): Promise<Question | null> {
        throw new Error("Method not implemented.");
    }
    findBySlug(slug: string): Promise<Question | null> {
        throw new Error("Method not implemented.");
    }
    findManyRecent(params: PaginationParams): Promise<Question[]> {
        throw new Error("Method not implemented.");
    }
    save(question: Question): Promise<void> {
        throw new Error("Method not implemented.");
    }
    create(question: Question): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(question: Question): Promise<void> {
        throw new Error("Method not implemented.");
    }
}