import { Test, TestingModule } from '@nestjs/testing';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { v4 } from 'uuid';
import { Player } from './schema/player.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('PlayersController', () => {
  let controller: PlayersController;
  let service: PlayersService;

  const createPlayerDto = new CreatePlayerDto();

  Object.assign(createPlayerDto, {
    name: 'Ricardo',
  });

  const expectedResult = new Player();

  Object.assign(expectedResult, {
    ...createPlayerDto,
    id: v4(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        PlayersService,
        {
          provide: getModelToken(Player.name),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call service with player data', async () => {
    const expectedResult = new Player();

    Object.assign(expectedResult, {
      ...createPlayerDto,
      id: v4(),
    });

    jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

    const result = await controller.create(createPlayerDto);

    expect(service.create).toBeCalledWith(createPlayerDto);
    expect(result).toStrictEqual(expectedResult);
  });

  it('findAll should return all players', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([expectedResult]);

    const result = await controller.findAll();

    expect(service.findAll).toBeCalled();
    expect(result).toStrictEqual([expectedResult]);
  });
});
