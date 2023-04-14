import container from '../../../../dependency_injection';
import Logger from '../../domain/Logger';

const logger = container.get<Logger>('Shared.Logger');
export default logger;
