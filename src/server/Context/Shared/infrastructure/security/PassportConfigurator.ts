import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStatic } from 'passport';
import { transformKey } from './transformKey';
import AccessDeniedError from './AccessDeniedError';
import { UserByEmailGetter } from '../../../Users/application/UserByEmailGetter';
import GetAccountByIdService from '../../../Accounts/domain/services/GetAccountByIdService';

export default class PassportConfigurator {
  constructor(
    private getUserByEmail: UserByEmailGetter,
    private getAccountById: GetAccountByIdService,
  ) {}

  private PUB_KEY = transformKey(process.env.PUB_KEY);
  private options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: this.PUB_KEY,
    algorithms: ['RS256'],
  };
  private strategy = new Strategy(this.options, async (payload, done) => {
    try {
      const user = await this.getUserByEmail.execute(payload.sub as string);
      if (!user) return done(null, false);

      return done(null, user);
    } catch (err) {
      done(new AccessDeniedError('invalid credentials'), false);
    }
  });

  public configurePassport = (passport: PassportStatic): void => {
    passport.use(this.strategy);
  };
}
