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

@Module({
    imports: [DatabaseModule, CryptographyModule],
    controllers: [
      CreateAccountController, 
      AuthenticateController, 
      CreateQuestionController, 
      FetchRecentQuestionsController,
      GetQuestionBySlugController
    ],
    providers: [
     CreateQuestionUseCase, 
     FetchRecentQuestionsUseCase, 
     AuthenticateStudentUseCase, 
     RegisterStudentUseCase,
     GetQuestionBySlugUseCase
    ],
})

export class HttpModule {}