import { ContainerBuilder, Reference } from "node-dependency-injection";
import PostCreator from "../../Context/Posts/application/PostCreator";
import MongoPostRepository from "../../Context/Posts/infrastructure/MongoPostRepository";
import MongoAccountRepository from "~/server/Context/Accounts/infrastructure/MongoAccountRepository";
import CreateSimpleAccountService from "~/server/Context/Accounts/domain/services/CreateSimpleAccountService";
import GetAccountByIdService from "~/server/Context/Accounts/domain/services/GetAccountByIdService";
import DeleteAccountService from "~/server/Context/Accounts/domain/services/DeleteAccountService";
import AccountByIdGetter from "~/server/Context/Accounts/application/AccountByIdGetter";
import AccountDeleter from "~/server/Context/Accounts/application/AccountDeleter";
import AccountInfoAdder from "~/server/Context/Accounts/application/AccountInfoAdder";
import DomainAdder from "~/server/Context/Accounts/application/DomainAdder";
import DomainDeleter from "~/server/Context/Accounts/application/DomainDeleter";
import PhotoUploader from "~/server/Context/Accounts/application/PhotoUploader";
import DeleteAllUsersService from "~/server/Context/Users/domain/DeleteAllUsersService";
import DeleteUserService from "~/server/Context/Users/domain/DeleteUserService";
import MongoUserRepository from "~/server/Context/Users/infrastructure/MongoUserRepository";
import { UserCreator } from "~/server/Context/Users/application/UserCreator";
import { UserByEmailGetter } from "~/server/Context/Users/application/UserByEmailGetter";
import MongoAudienceRepository from "~/server/Context/Audiences/infrastructure/MongoAudienceRepository";
import CheckAudienceMatchesAUserService from "~/server/Context/Audiences/domain/services/CheckAudienceMatchesAUserService";
import DeleteAllAudiencesService from "~/server/Context/Audiences/domain/services/DeleteAllAudiencesService";
import DeleteAudienceService from "~/server/Context/Audiences/domain/services/DeleteAudienceService";
import AllAudiencesGetter from "~/server/Context/Audiences/application/AllAudiencesGetter";
import AudienceByIdGetter from "~/server/Context/Audiences/application/AudienceByIdGetter";
import AudienceSaver from "~/server/Context/Audiences/application/AudienceSaver";
import MongoFlowRepository from "~/server/Context/Flows/infrastructure/db/repos/MongoFlowRepository";
import MongoPageRepository from "~/server/Context/Flows/infrastructure/db/repos/MongoPageRepository";
import AddFlowVisualizationService from "~/server/Context/Flows/domain/services/AddFlowVisualizationService";
import DeleteAllFlowsService from "~/server/Context/Flows/domain/services/DeleteAllFlowsService";
import DeleteFlowService from "~/server/Context/Flows/domain/services/DeleteFlowService";
import DeletePageService from "~/server/Context/Flows/domain/services/DeletePageService";
import GetFlowByIdService from "~/server/Context/Flows/domain/services/GetFlowByIdService";
import GetTheDatesOfAFlowService from "~/server/Context/Flows/domain/services/GetTheDatesOfAFlowService";
import IncreaseFlowBoostedRevenueService from "~/server/Context/Flows/domain/services/IncreaseFlowBoostedRevenueService";
import DesignAdder from "~/server/Context/Flows/application/DesignAdder";
import FlowActivator from "~/server/Context/Flows/application/FlowActivator";
import FlowByIdFromAccountGetter from "~/server/Context/Flows/application/FlowByIdFromAccountGetter";
import FlowByIdGetter from "~/server/Context/Flows/application/FlowByIdGetter";
import FlowDeactivator from "~/server/Context/Flows/application/FlowDeactivator";
import FlowSaver from "~/server/Context/Flows/application/FlowSaver";
import FlowsFromAccountGetter from "~/server/Context/Flows/application/FlowsFromAccountGetter";
import PaginatedAccountIdFlowsGetter from "~/server/Context/Flows/application/PaginatedAccountIdFlowsGetter";
import MongoOfferRepository from "~/server/Context/Offers/infrastructure/MongoOfferRepository";
import DeleteAllOffersService from "~/server/Context/Offers/domain/services/DeleteAllOffersService";
import DeleteOfferService from "~/server/Context/Offers/domain/services/DeleteOfferService";
import GenerateOfferResponseService from "~/server/Context/Offers/domain/services/GenerateOfferResponseService";
import GetOfferByIdService from "~/server/Context/Offers/domain/services/GetOfferByIdService";
import AllOffersGetter from "~/server/Context/Offers/application/AllOffersGetter";
import CouponPaymentDataGetter from "~/server/Context/Offers/application/CouponPaymentDataGetter";
import OfferByIdGetter from "~/server/Context/Offers/application/OfferByIdGetter";
import OfferSaver from "~/server/Context/Offers/application/OfferSaver";
import MongoPaymentProviderRepository from "~/server/Context/PaymentProviders/infrastructure/db/MongoPaymentProviderRepository";
import GetPaymentProviderService from "~/server/Context/PaymentProviders/domain/services/GetPaymentProviderService";
import ApplyOfferService from "~/server/Context/PaymentProviders/domain/services/ApplyOffersService";
import CreateStripePaymentProviderService from "~/server/Context/PaymentProviders/domain/services/CreateStripePaymentProviderService";
import DeleteAllPaymentProvidersOfAnAccountService from "~/server/Context/PaymentProviders/domain/services/DeleteAllPaymentProvidersOfAnAccountService";
import GetUserDataService from "~/server/Context/PaymentProviders/domain/services/GetUserDataService";
import IntegratedPaymentProvidersGetter from "~/server/Context/PaymentProviders/application/IntegratedPaymentProvidersGetter";
import PaymentProviderCreator from "~/server/Context/PaymentProviders/application/PaymentProviderCreator";
import PlansGetter from "~/server/Context/PaymentProviders/application/PlansGetter";
import MongoSessionRepository from "~/server/Context/Sessions/infrastructure/db/MongoSessionRepository";
import MongoCancellerHistoryRepository from "~/server/Context/Sessions/infrastructure/db/MongoCancellerHistoryRepository";
import AddSessionToCancellerHistoryService from "~/server/Context/Sessions/domain/services/AddSessionToCancellerHistoryService";
import DeleteAllSessionsOfAFlowService from "~/server/Context/Sessions/domain/services/DeleteAllSessionsOfAFlowService";
import ResolveFlowService from "~/server/Context/Sessions/domain/services/ResolveFlowService";
import ActivitiesOfAFlowGetter from "~/server/Context/Sessions/application/ActivitiesOfAFlowGetter";
import AllSessionsFromAccountGetter from "~/server/Context/Sessions/application/AllSessionsFromAccountGetter";
import AllSessionsFromFlowGetter from "~/server/Context/Sessions/application/AllSessionsFromFlowGetter";
import AllSessionsGetter from "~/server/Context/Sessions/application/AllSessionsGetter";
import AnswerAdder from "~/server/Context/Sessions/application/AnswerAdder";
import GoBackHandler from "~/server/Context/Sessions/application/GoBackHandler";
import PreviewSessionDestroyer from "~/server/Context/Sessions/application/PreviewSessionDestroyer";
import PreviewSessionStarter from "~/server/Context/Sessions/application/PreviewSessionStarter";
import SessionsByIdFromAccountGetter from "~/server/Context/Sessions/application/SessionsByIdFromAccountGetter";
import SessionByIdGetter from "~/server/Context/Sessions/application/SessionByIdGetter";
import SessionInitializer from "~/server/Context/Sessions/application/SessionInitializer";
import StatsCalculator from "~/server/Context/Sessions/application/StatsCalculator";

const container = new ContainerBuilder();
container.register("Posts.domain.PostRepository", MongoPostRepository);
container
  .register("Posts.application.PostCreator", PostCreator)
  .addArgument(new Reference("Posts.domain.PostRepository"));

//Accounts ----------------------------------------------------------
container.register("Accounts.domain.AccountRepository", MongoAccountRepository);

container
  .register(
    "Accounts.domain.CreateSimpleAccountService",
    CreateSimpleAccountService,
  )
  .addArgument("Accounts.domain.AccountRepository");

container
  .register("Accounts.domain.GetAccountByIdService", GetAccountByIdService)
  .addArgument("Accounts.domain.AccountRepository");

container
  .register("Accounts.domain.DeleteAccountService", DeleteAccountService)
  .addArgument("Accounts.domain.AccountRepository")
  .addArgument("Users.domain.DeleteAllUsersService")
  .addArgument("Offers.domain.DeleteAllOffersService")
  .addArgument("Audiences.domain.DeleteAllAudiencesService")
  .addArgument("Flows.domain.DeleteAllFlowsService")
  .addArgument(
    "PaymentProviders.domain.DeleteAllPaymentProvidersOfAnAccountService",
  );

container
  .register("Accounts.application.AccountByIdGetter", AccountByIdGetter)
  .addArgument("Accounts.domain.AccountRepository");

container
  .register("Accounts.application.AccountDeleter", AccountDeleter)
  .addArgument("Accounts.domain.DeleteAccountService");

container
  .register("Accounts.application.AccountInfoAdder", AccountInfoAdder)
  .addArgument("Accounts.domain.AccountRepository")
  .addArgument("PaymentProviders.domain.CreateStripePaymentProviderService");

container
  .register("Accounts.application.DomainAdder", DomainAdder)
  .addArgument("Accounts.domain.AccountRepository");

container
  .register("Accounts.application.DomainDeleter", DomainDeleter)
  .addArgument("Accounts.domain.AccountRepository");

container
  .register("Accounts.application.PhotoUploader", PhotoUploader)
  .addArgument("Accounts.domain.AccountRepository");

//Users ----------------------------------------------------------
container.register("Users.domain.UserRepository", MongoUserRepository);

container
  .register("Users.domain.DeleteAllUsersService", DeleteAllUsersService)
  .addArgument("Users.domain.UserRepository");

container
  .register("Users.domain.DeleteUserService", DeleteUserService)
  .addArgument("Users.domain.UserRepository");

container
  .register("Users.application.UserCreator", UserCreator)
  .addArgument("Users.domain.UserRepository")
  .addArgument("Accounts.domain.CreateSimpleAccountService");

container
  .register("Users.application.UserByEmailGetter", UserByEmailGetter)
  .addArgument("Users.domain.UserRepository")
  .addArgument("Accounts.domain.AccountRepository");

//Audiences ----------------------------------------------------------
container.register(
  "Audiences.domain.AudienceRepository",
  MongoAudienceRepository,
);
container
  .register(
    "Audiences.domain.CheckAudienceMatchesAUserService",
    CheckAudienceMatchesAUserService,
  )
  .addArgument("Audiences.domain.AudienceRepository");
container
  .register(
    "Audiences.domain.DeleteAllAudiencesService",
    DeleteAllAudiencesService,
  )
  .addArgument("Audiences.domain.AudienceRepository");
container
  .register("Audiences.domain.DeleteAudienceService", DeleteAudienceService)
  .addArgument("Audiences.domain.AudienceRepository");
container
  .register("Audiences.application.AllAudiencesGetter", AllAudiencesGetter)
  .addArgument("Audiences.domain.AudienceRepository");
container
  .register("Audiences.application.AudienceByIdGetter", AudienceByIdGetter)
  .addArgument("Audiences.domain.AudienceRepository");
container
  .register("Audiences.application.AudienceSaver", AudienceSaver)
  .addArgument("Audiences.domain.AudienceRepository");

//Flows ----------------------------------------------------------
container.register("Flows.domain.FlowRepository", MongoFlowRepository);
container.register("Flows.domain.PageRepository", MongoPageRepository);
container
  .register(
    "Flows.domain.AddFlowVisualizationService",
    AddFlowVisualizationService,
  )
  .addArgument("Flows.domain.FlowRepository");
container
  .register("Flows.domain.DeleteAllFlowsService", DeleteAllFlowsService)
  .addArgument("Flows.domain.FlowRepository")
  .addArgument("Flows.domain.DeleteFlowService");
container
  .register("Flows.domain.DeleteFlowService", DeleteFlowService)
  .addArgument("Flows.domain.FlowRepository")
  .addArgument("Flows.domain.DeletePageService")
  .addArgument("Sessions.domain.DeleteAllSessionsOfAFlowService");
container
  .register("Flows.domain.DeletePageService", DeletePageService)
  .addArgument("Flows.domain.PageRepository");
container
  .register("Flows.domain.GetFlowByIdService", GetFlowByIdService)
  .addArgument("Flows.domain.FlowRepository");
container
  .register("Flows.domain.GetTheDatesOfAFlowService", GetTheDatesOfAFlowService)
  .addArgument("Flows.domain.FlowRepository");
container
  .register(
    "Flows.domain.IncreaseFlowBoostedRevenueService",
    IncreaseFlowBoostedRevenueService,
  )
  .addArgument("Flows.domain.FlowRepository");
container
  .register("Flows.application.DesignAdder", DesignAdder)
  .addArgument("Flows.domain.FlowRepository");
container
  .register("Flows.application.FlowActivator", FlowActivator)
  .addArgument("Flows.domain.FlowRepository");
container
  .register(
    "Flows.application.FlowByIdFromAccountGetter",
    FlowByIdFromAccountGetter,
  )
  .addArgument("Flows.domain.FlowRepository");
container
  .register("Flows.application.FlowByIdGetter", FlowByIdGetter)
  .addArgument("Flows.domain.FlowRepository");
container
  .register("Flows.application.FlowDeactivator", FlowDeactivator)
  .addArgument("Flows.domain.FlowRepository");
container
  .register("Flows.application.FlowSaver", FlowSaver)
  .addArgument("Flows.domain.FlowRepository");
container
  .register("Flows.application.FlowsFromAccountGetter", FlowsFromAccountGetter)
  .addArgument("Flows.domain.FlowRepository");
container
  .register(
    "Flows.application.PaginatedAccountIdFlowsGetter",
    PaginatedAccountIdFlowsGetter,
  )
  .addArgument("Flows.domain.FlowRepository");

//Offers ---------------------------------------------------------
container.register("Offers.domain.OfferRepository", MongoOfferRepository);
container
  .register("Offers.domain.DeleteAllOffersService", DeleteAllOffersService)
  .addArgument("Offers.domain.OfferRepository");
container
  .register("Offers.domain.DeleteOfferService", DeleteOfferService)
  .addArgument("Offers.domain.OfferRepository");
container
  .register(
    "Offers.domain.GenerateOfferResponseService",
    GenerateOfferResponseService,
  )
  .addArgument("Offers.application.OfferByIdGetter");
container
  .register("Offers.domain.GetOfferByIdService", GetOfferByIdService)
  .addArgument("Offers.domain.OfferRepository");
container
  .register("Offers.application.AllOffersGetter", AllOffersGetter)
  .addArgument("Offers.domain.OfferRepository");
container
  .register(
    "Offers.application.CouponPaymentDataGetter",
    CouponPaymentDataGetter,
  )
  .addArgument("PaymentProviders.domain.GetPaymentProviderService");
container
  .register("Offers.application.OfferByIdGetter", OfferByIdGetter)
  .addArgument("Offers.domain.OfferRepository");
container
  .register("Offers.application.OfferSaver", OfferSaver)
  .addArgument("Offers.domain.OfferRepository");

//PaymentProviders ----------------------------------------------------------
container.register(
  "PaymentProviders.domain.PaymentProviderRepository",
  MongoPaymentProviderRepository,
);
container
  .register(
    "PaymentProviders.domain.GetPaymentProviderService",
    GetPaymentProviderService,
  )
  .addArgument("PaymentProviders.domain.PaymentProviderRepository")
  .addArgument("Accounts.domain.GetAccountByIdService");
container
  .register("PaymentProviders.domain.ApplyOfferService", ApplyOfferService)
  .addArgument("PaymentProviders.domain.GetPaymentProviderService");
container
  .register(
    "PaymentProviders.domain.CreateStripePaymentProviderService",
    CreateStripePaymentProviderService,
  )
  .addArgument("PaymentProviders.domain.PaymentProviderRepository");
container
  .register(
    "PaymentProviders.domain.DeleteAllPaymentProvidersOfAnAccountService",
    DeleteAllPaymentProvidersOfAnAccountService,
  )
  .addArgument("PaymentProviders.domain.PaymentProviderRepository");
container
  .register("PaymentProviders.domain.GetUserDataService", GetUserDataService)
  .addArgument("PaymentProviders.domain.GetPaymentProviderService");
container
  .register(
    "PaymentProviders.application.IntegratedPaymentProvidersGetter",
    IntegratedPaymentProvidersGetter,
  )
  .addArgument("PaymentProviders.domain.PaymentProviderRepository");
container
  .register(
    "PaymentProviders.application.PaymentProviderCreator",
    PaymentProviderCreator,
  )
  .addArgument("PaymentProviders.domain.PaymentProviderRepository");
container
  .register("PaymentProviders.application.PlansGetter", PlansGetter)
  .addArgument("PaymentProviders.domain.GetPaymentProviderService");

//Sessions -------------------------------------------------------
container.register("Sessions.domain.SessionRepository", MongoSessionRepository);
container.register(
  "Sessions.domain.CancellerHistoryRepository",
  MongoCancellerHistoryRepository,
);
container
  .register(
    "Sessions.domain.AddSessionToCancellerHistoryService",
    AddSessionToCancellerHistoryService,
  )
  .addArgument("Sessions.domain.CancellerHistoryRepository");
container
  .register(
    "Sessions.domain.DeleteAllSessionsOfAFlowService",
    DeleteAllSessionsOfAFlowService,
  )
  .addArgument("Sessions.domain.SessionRepository");
container
  .register("Sessions.domain.ResolveFlowService", ResolveFlowService)
  .addArgument("Flows.domain.FlowRepository")
  .addArgument("Flows.domain.AddFlowVisualizationService");
container
  .register(
    "Sessions.application.ActivitiesOfAFlowGetter",
    ActivitiesOfAFlowGetter,
  )
  .addArgument("Sessions.domain.SessionRepository");
container
  .register(
    "Sessions.application.AllSessionsFromAccountGetter",
    AllSessionsFromAccountGetter,
  )
  .addArgument("Sessions.domain.SessionRepository");
container
  .register(
    "Sessions.application.AllSessionsFromFlowGetter",
    AllSessionsFromFlowGetter,
  )
  .addArgument("Sessions.domain.SessionRepository")
  .addArgument("Flows.domain.GetFlowByIdService");
container
  .register("Sessions.application.AllSessionsGetter", AllSessionsGetter)
  .addArgument("Sessions.domain.SessionRepository");
container
  .register("Sessions.application.AnswerAdder", AnswerAdder)
  .addArgument("Sessions.domain.SessionRepository")
  .addArgument("PaymentProviders.domain.ApplyOfferService")
  .addArgument("Flows.domain.IncreaseFlowBoostedRevenueService")
  .addArgument("Sessions.domain.AddSessionToCancellerHistoryService");
container
  .register("Sessions.application.GoBackHandler", GoBackHandler)
  .addArgument("Sessions.domain.SessionRepository");
container
  .register(
    "Sessions.application.PreviewSessionDestroyer",
    PreviewSessionDestroyer,
  )
  .addArgument("Sessions.domain.SessionRepository");
container
  .register("Sessions.application.PreviewSessionStarter", PreviewSessionStarter)
  .addArgument("Sessions.domain.SessionRepository")
  .addArgument("Flows.domain.GetFlowByIdService");
container
  .register(
    "Sessions.application.SessionsByIdFromAccountGetter",
    SessionsByIdFromAccountGetter,
  )
  .addArgument("Sessions.domain.SessionRepository");
container
  .register("Sessions.application.SessionByIdGetter", SessionByIdGetter)
  .addArgument("Sessions.domain.SessionRepository");
container
  .register("Sessions.application.SessionInitializer", SessionInitializer)
  .addArgument("Sessions.domain.SessionRepository")
  .addArgument("PaymentProviders.domain.GetUserDataService")
  .addArgument("Sessions.domain.ResolveFlowService");
container
  .register("Sessions.application.StatsCalculator", StatsCalculator)
  .addArgument("Sessions.domain.CancellerHistoryRepository");

export default container;
