import { Account } from '../account';
import AccountRepository from '../repos/accountRepository';
import DeleteAllUsersService from '../../../Users/domain/DeleteAllUsersService';
import DeleteAllOffersService from '../../../../Clickout/Offers/domain/services/DeleteAllOffersService';
import DeleteAllAudiencesService from '../../../../Clickout/Audiences/domain/services/DeleteAllAudiencesService';
import DeleteAllFlowsService from '../../../../Clickout/Flows/domain/services/DeleteAllFlowsService';
import DeleteAllPaymentProvidersOfAnAccountService from '../../../../Clickout/PaymentProviders/domain/services/DeleteAllPaymentProvidersOfAnAccountService';

export default class DeleteAccountService {
  constructor(
    private accountRepo: AccountRepository,
    private deleteAllUsersService: DeleteAllUsersService,
    private deleteAllOffersService: DeleteAllOffersService,
    private deleteAllAudiencesService: DeleteAllAudiencesService,
    private deleteAllFlowsService: DeleteAllFlowsService,
    private deleteAllPaymentProvidersOfAnAccountService: DeleteAllPaymentProvidersOfAnAccountService,
  ) {}

  public async execute(account: Account) {
    await this.deleteAllAudiencesService.execute(account.id);
    await this.deleteAllOffersService.execute(account.id);
    await this.deleteAllFlowsService.execute(account.id);
    await this.deleteAllUsersService.execute(account.id.value);
    await this.deleteAllPaymentProvidersOfAnAccountService.execute(account.id);

    await this.accountRepo.delete(account.id.value);
  }
}
