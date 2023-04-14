export default class PageAlreadyExistError extends Error {
  constructor(pageId: string) {
    super(`Page already exist: ${pageId}`);
  }
}
