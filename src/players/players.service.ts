import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player, PlayerDocument } from './schema/player.schema';

@Injectable()
export class PlayersService {
  private logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<PlayerDocument>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playerModel.create(createPlayerDto);
  }

  async findAll(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async update(_id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.playerModel
      .findOneAndUpdate({ _id }, updatePlayerDto, { new: true })
      .exec();

    return player;
  }
}
