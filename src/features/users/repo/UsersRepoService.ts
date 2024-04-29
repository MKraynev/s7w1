import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Raw, Repository } from 'typeorm';
import { UserRepoEntity } from './entities/UsersRepoEntity';
import { UserControllerRegistrationEntity } from 'src/features/users/controllers/entities/UsersControllerRegistrationEntity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepoService {
  constructor(
    @InjectRepository(UserRepoEntity)
    private userRepo: Repository<UserRepoEntity>,
  ) {}

  public async Create(
    userData: UserControllerRegistrationEntity,
    confirmed: boolean = false,
  ) {
    let userDto = await UserRepoEntity.Init(userData, confirmed);
    let savedUser = await this.userRepo.save(userDto);

    return savedUser;
  }

  public async ReadManyLikeByLoginByEmail(
    login: string,
    email: string,
    sortBy: keyof UserRepoEntity = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    skip: number = 0,
    limit: number = 10,
  ) {
    if (login === undefined && email === undefined)
      return { countAll: 0, foundusers: [] };

    let caseInsensitiveSearchPattern = (column: string, inputValue: string) =>
      `LOWER(${column}) Like '%${inputValue.toLowerCase()}%'`;

    let loginSearchPatten: FindOptionsWhere<UserRepoEntity> = {};
    let emailSearchPatten: FindOptionsWhere<UserRepoEntity> = {};
    let whereStatement: FindOptionsWhere<UserRepoEntity>[] = [];

    if (login) {
      loginSearchPatten['login'] = Raw((alias) =>
        caseInsensitiveSearchPattern(alias, login),
      );

      whereStatement.push(loginSearchPatten);
    }

    if (email) {
      emailSearchPatten['email'] = Raw((alias) =>
        caseInsensitiveSearchPattern(alias, email),
      );
      whereStatement.push(emailSearchPatten);
    }

    let orderObj: any = {};
    orderObj[sortBy] = sortDirection;

    let countAll = await this.userRepo.count({ where: whereStatement });

    let foundusers = await this.userRepo.find({
      where: whereStatement,
      order: orderObj,
      skip: skip,
      take: limit,
    });

    return { countAll, foundusers };
  }

  public async ReadManyCertainByLoginByEmail(login: string, email: string) {
    let founduser = await this.userRepo.find({
      where: [{ login: login }, { email: email }],
    });

    return founduser;
  }

  public async ReadOneFullyByLoginOrEmail(loginOrEmail: string) {
    let founduser = await this.userRepo.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
      relations: { devices: true },
    });

    return founduser;
  }

  public async ReadOneById(userId: string) {
    let id_num = +userId;

    return await this.userRepo.findOne({
      where: { id: id_num },
      relations: { devices: true },
    });
  }

  public async ReadOneByPropertyValue(
    propertyName: keyof UserRepoEntity,
    propertyValue: any,
  ) {
    let findObj: any = {};
    findObj[propertyName] = propertyValue;

    return await this.userRepo.findOne({ where: findObj });
    // return await this.userRepo.findOne(findObj)
  }

  public async UpdateOne(user: UserRepoEntity) {
    let updatedUser = await this.userRepo.save(user);

    return updatedUser;
  }
  public async GetIdLogin(
    user_1_id: string | number,
    user_2_id: string | number,
  ) {
    let usersInfo = (await this.userRepo
      .createQueryBuilder()
      .select('id, login')
      .where('id = :id1 OR id = :id2', { id1: user_1_id, id2: user_2_id })
      .execute()) as { id: number; login: string }[];

    return usersInfo;
  }

  public async DeleteOne(id: number) {
    let del = await this.userRepo.delete({ id: id });

    return del.affected;
  }

  public async DeleteAll() {
    let deleteAll = await this.userRepo.delete({});

    return deleteAll.affected;
  }

  public async ReadAll() {
    return await this.userRepo.find({});
  }
}
