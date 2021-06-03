import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player, PlayerDocument } from './schema/player.schema';
import { PlayersService } from './players.service';

describe('PlayersService', () => {
  let service: PlayersService;
  let model: Model<PlayerDocument>;

  const playerDTO = new CreatePlayerDto();
  const playerId = v4();
  const expectedResult = new Player();

  Object.assign(playerDTO, {
    name: 'Ricardo',
  });

  Object.assign(expectedResult, {
    ...playerDTO,
    id: playerId,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: getModelToken(Player.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOneAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    model = module.get<Model<PlayerDocument>>(getModelToken(Player.name));
    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create on service should call mongodb create', async () => {
    const spy = jest
      .spyOn(model, 'create')
      .mockImplementation(() => expectedResult);

    const result = await service.create(playerDTO);

    expect(spy).toBeCalledTimes(1);
    expect(result).toBe(expectedResult);
  });

  it('find all should return all players', async () => {
    const players = [expectedResult];

    const spy = jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue(players),
    } as any);

    const result = await service.findAll();

    expect(spy).toBeCalledTimes(1);
    expect(result).toStrictEqual(players);
  });

  it('update should return updated object', async () => {
    const spy = jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValue(expectedResult),
    } as any);

    const result = await service.update(playerId, playerDTO);

    expect(spy).toBeCalledTimes(1);
    expect(result).toBe(expectedResult);
  });
});
