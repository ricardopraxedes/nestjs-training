import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { Player } from './schema/player.schema';

describe('PlayersController', () => {
  let controller: PlayersController;
  let service: PlayersService;

  const playerDTO = new CreatePlayerDto();
  const expectedResult = new Player();
  const playerId = v4();

  Object.assign(playerDTO, {
    name: 'Ricardo',
  });

  Object.assign(expectedResult, {
    ...playerDTO,
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
    jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

    const result = await controller.create(playerDTO);

    expect(service.create).toBeCalledWith(playerDTO);
    expect(result).toStrictEqual(expectedResult);
  });

  it('findAll should call service and return all players', async () => {
    const expectedResult = new Player();

    const playerId = v4();

    Object.assign(expectedResult, {
      ...playerDTO,
      id: playerId,
    });

    jest.spyOn(service, 'findAll').mockResolvedValue([expectedResult]);

    const result = await controller.findAll();

    expect(service.findAll).toBeCalled();
    expect(result).toStrictEqual([expectedResult]);
  });

  it('update should call service with id and return updated object', async () => {
    jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

    const result = await controller.update(playerId, playerDTO);

    expect(service.update).toBeCalledWith(playerId, playerDTO);
    expect(result).toBe(expectedResult);
  });

  it('delete should call service with id', async () => {
    jest.spyOn(service, 'delete').mockImplementation();

    await service.delete(playerId);

    expect(service.delete).toBeCalledWith(playerId);
  });
});
