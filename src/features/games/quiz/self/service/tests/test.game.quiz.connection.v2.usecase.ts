import { TestingModule } from "@nestjs/testing";
import { GameQuizConnectionV2UseCase } from "../use-cases/game.quiz.connection.v2.usecase";
import { TestGameQuizModule } from "./settings/game.quiz.testing.module";

describe(`${GameQuizConnectionV2UseCase.name} test`, () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await TestGameQuizModule.compile();

    await module.init();
  });

  afterAll(async () => {
    await module.close();
  });

  it("works", () => {
    expect(0).toEqual(0);
  });
});
