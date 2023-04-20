import Logger from "../../domain/Logger";
import container from "~/server/api/dependency_injection";

const logger = container.get<Logger>("Shared.Logger");
export default logger;
