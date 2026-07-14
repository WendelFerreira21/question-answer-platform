import { Delete, Module } from "@nestjs/common";
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
import { EditQuestionController } from "./controllers/edit-question.controller";
import { EditQuestionUseCase } from "../../../src/domain/forum/application/use-cases/edit-question";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { DeleteQuestionUseCase } from "../../../src/domain/forum/application/use-cases/delete-question";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { AnswerQuestionUseCase } from "../../../src/domain/forum/application/use-cases/answer-question";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { EditAnswerUseCase } from "../../../src/domain/forum/application/use-cases/edit-answer";
import { DeleteAnswerController } from "./controllers/delete-answer.controller";
import { DeleteAnswerUseCase } from "../../../src/domain/forum/application/use-cases/delete-answer";
import { FetchQuestionAnswersController } from "./controllers/fetch-question-answers.controller";
import { FetchQuestionAnswersUseCase } from "../../../src/domain/forum/application/use-cases/fetch-question-answers";
import { ChooseQuestionBestAnswerController } from "./controllers/choose-question-best-answer.controller";
import { CommentOnQuestionController } from "./controllers/comment-on-question.controller";
import { ChooseQuestionBestAnswerUseCase } from "../../../src/domain/forum/application/use-cases/choose-question-best-answer";
import { CommentOnQuestionUseCase } from "../../../src/domain/forum/application/use-cases/comment-on-question";
import { DeleteQuestionCommentController } from "./controllers/delete-question-comment.controller";
import { DeleteQuestionCommentUseCase } from "../../../src/domain/forum/application/use-cases/delete-question-comment";
import { CommentOnAnswerController } from "./controllers/comment-on-answer.controller";
import { CommentOnAnswerUseCase } from "../../../src/domain/forum/application/use-cases/comment-on-answer";
import { FetchQuestionCommentsController } from "./controllers/fetch-question-comments.controller";
import { FetchQuestionCommentsUseCase } from "../../../src/domain/forum/application/use-cases/fetch-question-comments";
import { FetchAnswerCommentsController } from "./controllers/fetch-answer-comments.controller";
import { FetchAnswerCommentsUseCase } from "../../../src/domain/forum/application/use-cases/fetch-answer-comments";

@Module({
    imports: [DatabaseModule, CryptographyModule],
    controllers: [
      CreateAccountController, 
      AuthenticateController, 
      CreateQuestionController, 
      FetchRecentQuestionsController,
      GetQuestionBySlugController,
      EditQuestionController,
      DeleteQuestionController,
      DeleteAnswerController,
      AnswerQuestionController,
      EditAnswerController,
      FetchQuestionAnswersController,
      ChooseQuestionBestAnswerController,
      CommentOnQuestionController,
      DeleteQuestionCommentController,
      CommentOnAnswerController,
      FetchQuestionCommentsController,
      FetchAnswerCommentsController
    ],
    providers: [
     CreateQuestionUseCase, 
     FetchRecentQuestionsUseCase, 
     AuthenticateStudentUseCase, 
     RegisterStudentUseCase,
     GetQuestionBySlugUseCase,
     EditQuestionUseCase,
     DeleteQuestionUseCase,
     DeleteAnswerUseCase,
     AnswerQuestionUseCase,
     EditAnswerUseCase,
     FetchQuestionAnswersUseCase,
     ChooseQuestionBestAnswerUseCase,
     CommentOnQuestionUseCase,
     DeleteQuestionCommentUseCase,
     CommentOnAnswerUseCase,
     FetchQuestionCommentsUseCase,
     FetchAnswerCommentsUseCase
    ],
})

export class HttpModule {}