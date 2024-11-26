import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Profile, User } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Profile.name)
    private readonly profileModel: Model<Profile>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { code, username, ...userData } = createUserDto;

    await this.checkEmailExists(userData.email);

    await this.checkUsernameExists(username);

    try {
      const user = await this.userModel.create({ ...userData });

      await this.profileModel.create({ code, username, user: user.id });

      return this.findOne(user._id);
    } catch (error) {
      throw new InternalServerErrorException(`Error when trying to create a new user`);
    }
  }

  async findAll() {
    try {
      const usersList = await this.userModel.find().select('-__v').lean();

      const response = await Promise.all(
        usersList.map(async (user) => {
          const profile = await this.getProfileByUserId(String(user._id));

          return {
            ...profile,
            ...user,
          };
        }),
      );

      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error when trying to get the users list`);
    }
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-__v').lean();

    if (!user) throw new NotFoundException(`User with id "${id}" not found`);

    const profile = await this.getProfileByUserId(id);

    return { ...user, ...profile };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { code, username, ...userData } = updateUserDto;

    await this.findOne(id);

    try {
      await this.userModel.findByIdAndUpdate(id, { ...userData });

      await this.profileModel.findOneAndUpdate({ user: id }, { code, username });

      return this.findOne(id);
    } catch (error) {
      console.log({ error });

      throw new InternalServerErrorException(`Error when trying to update a user`);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    try {
      await this.userModel.deleteOne({ _id: id });

      await this.profileModel.deleteOne({ user: id });

      return user;
    } catch (error) {
      throw new InternalServerErrorException(`Error when trying to delete a user`);
    }

    return user;
  }

  private async checkEmailExists(email: string) {
    const user = await this.userModel.findOne({ email });

    if (user) throw new ConflictException(`User with email '${email}' already exist`);

    return user;
  }

  private async checkUsernameExists(username: string) {
    const profile = await this.profileModel.findOne({ username });

    if (profile) throw new ConflictException(`Profile with username '${username}' already exist`);

    return profile;
  }

  private async getProfileByUserId(userId: string) {
    const profile = await this.profileModel
      .findOne({ user: userId })
      .select(['-__v', '-user', '-_id'])
      .lean();

    if (!profile) throw new NotFoundException(`Profile with userId '${userId}' not found`);

    return profile;
  }
}
