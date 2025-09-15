import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokensDto } from './dto/tokens.dto';
import * as bcrypt from 'bcrypt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from 'libs/user/entities/account.entity';
import { DataSource, Repository } from 'typeorm';
import { PayloadDto } from './dto/payload.dto';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'libs/user/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectDataSource() private readonly dataSource: DataSource, // @InjectRepository(AccountEntity) // private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async findByEmail(email: string) {
    const repo = this.dataSource.getRepository(AccountEntity);
    return repo.findOne({ where: { email } });
  }

  public async login(input: LoginDto): Promise<TokensDto> {
    const findUser = await this.findByEmail(input.email);
    if (!findUser) {
      throw new UnauthorizedException('Email or password is invalid');
    }

    const checkPass = await this.comparePassword(
      input.password,
      findUser.password,
    );

    if (!checkPass) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const payload: PayloadDto = {
      email: input.email,
      role: findUser.role,
    };

    const tokens: TokensDto = await this.getTokens(payload);

    findUser.refreshToken = tokens.refreshToken;
    await this.dataSource
      .getRepository(AccountEntity)
      .update({ email: findUser.email }, findUser);

    return tokens;
  }

  public async register(input: RegisterDto): Promise<TokensDto> {
    const findUser = await this.findByEmail(input.email);

    if (findUser) {
      throw new ConflictException('User already exists'); // ném lỗi
    }

    input.password = await bcrypt.hash(input.password, 12); // hash pass

    const newUser = this.dataSource.getRepository(AccountEntity).create(input);
    await this.dataSource.getRepository(AccountEntity).save(newUser);

    const tokens = await this.getTokens({
      email: newUser.email,
      role: Role.User,
    });

    await this.dataSource
      .getRepository(AccountEntity)
      .update({ email: newUser.email }, { refreshToken: tokens.refreshToken });
    return tokens;
  }

  public async logout(email: string): Promise<boolean> {
    const findUser = await this.dataSource
      .getRepository(AccountEntity)
      .findOne({
        where: {
          email: email,
        },
      });

    if (!findUser) {
      throw new UnauthorizedException('Email or password is invalid');
    }

    await this.dataSource
      .getRepository(AccountEntity)
      .update({ email }, { refreshToken: null });

    console.log(`${email} đã đăng xuất!`);
    return true;
  }

  //function compare password param with user password in database
  private async comparePassword(
    password: string,
    storePasswordHash: string,
  ): Promise<any> {
    return await bcrypt.compare(password, storePasswordHash);
  }

  // gettoken -> [access,refresh] -> create sign
  private async getTokens(payload: PayloadDto): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { payload },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: 60 * 60, // 1h
        },
      ),
      this.jwtService.signAsync(
        { payload },
        {
          secret: this.configService.get<string>('REFRESH_JWT_SECRET_KEY'),
          expiresIn: 60 * 60 * 24, // 1 day
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async validateUser(username: string, pass: string) {
    const user = await this.dataSource.getRepository(AccountEntity).findOne({
      where: {
        email: username,
      },
    });

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
