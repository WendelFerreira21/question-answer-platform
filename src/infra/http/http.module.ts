import { Module } from "@nestjs/common";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { CryptographyModule } from "../crypotgraphy/crypotgraphy.module";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug-controller";
import { GetQuestionBySlugUseCase } from "../../../src/domain/forum/application/use-cases/get-question-by-slug";
import { EditquestionController } from "./controllers/edit-question.controller";
import { EditQuestionUseCase } from "../../../src/domain/forum/application/use-cases/edit-question";
import { DeletequestionController } from "./controllers/delete-question.controller";
import { DeleteQuestionUseCase } from "../../../src/domain/forum/application/use-cases/delete-question";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { AnswerQuestionUseCase } from "../../../src/domain/forum/application/use-cases/answer-question";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { EditAnswerUseCase } from "../../../src/domain/forum/application/use-cases/edit-answer";

@Module({
    imports: [DatabaseModule, CryptographyModule],
    controllers: [
      CreateAccountController, 
      AuthenticateController, 
      CreateQuestionController, 
      FetchRecentQuestionsController,
      GetQuestionBySlugController,
      EditquestionController,
      DeletequestionController,
      AnswerQuestionController,
      EditAnswerController
    ],
    providers: [
     CreateQuestionUseCase, 
     FetchRecentQuestionsUseCase, 
     AuthenticateStudentUseCase, 
     RegisterStudentUseCase,
     GetQuestionBySlugUseCase,
     EditQuestionUseCase,
     DeleteQuestionUseCase,
     AnswerQuestionUseCase,
     EditAnswerUseCase
    ],
})

export class HttpModule {}