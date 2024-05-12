export class QuizGameComplexInfo {
  public firstPlayerProgress: {
    answers: { questionId: string; answerStatus: "Incorrect" | "Correct"; addedAt: Date }[];
    player: { id: string; login: string };
    score: number;
  } = {
    answers: [],
    player: {
      id: null,
      login: null,
    },
    score: 0,
  };

  public secondPlayerProgress: {
    answers: { questionId: string; answerStatus: "Incorrect" | "Correct"; addedAt: Date }[];
    player: { id: string; login: string };
    score: number;
  } = null;

  public questions: { id: string; body: string }[] = [];

  constructor(
    public id: string,
    p1_id: string,
    p1_login: string,
    public status: string,
    public pairCreatedDate: Date,
    public startGameDate: Date,
    public finishGameDate: Date,
  ) {
    this.firstPlayerProgress.player.id = p1_id;
    this.firstPlayerProgress.player.login = p1_login;
  }
  public setFirstPlayerProgress(
    p1_answers: { questionId: string; answerStatus: "Incorrect" | "Correct"; addedAt: Date }[],
    p1_score: number,
  ) {
    this.firstPlayerProgress.answers = p1_answers;
    this.firstPlayerProgress.score = p1_score;
  }

  public SetSecondPlayerProgress(
    p2_id: string,
    p2_login: string,
    answers: { questionId: string; answerStatus: "Incorrect" | "Correct"; addedAt: Date }[],
    p2_score: number,
  ) {
    this.secondPlayerProgress = {
      answers: answers,
      player: {
        id: p2_id,
        login: p2_login,
      },
      score: p2_score,
    };
  }
}

/*
    "id": "string",
    "firstPlayerProgress": {
      "answers": [
        {
          "questionId": "string",
          "answerStatus": "Correct",
          "addedAt": "2024-04-30T12:18:29.054Z"
        }
      ],
      "player": {
        "id": "string",
        "login": "string"
      },
      "score": 0
    },
    "secondPlayerProgress": {
      "answers": [
        {
          "questionId": "string",
          "answerStatus": "Correct",
          "addedAt": "2024-04-30T12:18:29.054Z"
        }
      ],
      "player": {
        "id": "string",
        "login": "string"
      },
      "score": 0
    },
    "questions": [
      {
        "id": "string",
        "body": "string"
      }
    ],
    "status": "PendingSecondPlayer",
    "pairCreatedDate": "2024-04-30T12:18:29.054Z",
    "startGameDate": "2024-04-30T12:18:29.054Z",
    "finishGameDate": "2024-04-30T12:18:29.054Z"
  }
  */
