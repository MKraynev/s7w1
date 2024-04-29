import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GamesRepoEntity } from './entities/GamesRepoEntity';
import { QuizGameInfo } from '../controller/entities/QuizGameGetMyCurrent/QuizGameGetMyCurrentUsecaseEntity';

export class GamesRepoService {
  constructor(
    @InjectRepository(GamesRepoEntity)
    private repo: Repository<GamesRepoEntity>,
    @InjectDataSource() public dataSource: DataSource,
  ) {}

  public async CreateGame(userId: number) {
    //TODO сделать создание игры
    let game = GamesRepoEntity.Init(userId);
    let savedGame = await this.repo.save(game);
    return savedGame;
  }
  public async GetUserCurrentGame(userId: string): Promise<GamesRepoEntity> {
    let result: QuizGameInfo;

    let gameInfo = await this.repo
      .createQueryBuilder('game')
      .where('game.player_1_id = :id OR game.player_2_id = :id', { id: userId })
      .andWhere('game.status = :active OR game.status = :pending', {
        active: 'Active',
        pending: 'PendingSecondPlayer',
      })
      .getOneOrFail();

    return gameInfo;
  }

  public async GetSearchingGame(): Promise<GamesRepoEntity | null> {
    let game = await this.repo.findOne({
      where: { status: 'PendingSecondPlayer' },
    });

    return game;
  }

  public async DeleteAll() {
    await this.repo.delete({});
  }
}