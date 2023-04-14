export default class PageCouldNotBeCreated extends Error {
  constructor(pageId: string) {
    super(`Page could not be created: ${pageId}`);
  }
}
