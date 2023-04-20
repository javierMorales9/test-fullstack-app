import { Page } from "../../../domain/pages/Page";
import { createPageFromNonSchemaData } from "../../../domain/pages/PageFactory";

export function transformToArrayOfPagesFromRepo(mongoPages: any[]): Page[] {
  const pages: Page[] = [];

  for (const mongoPage of mongoPages) {
    const page = transformToPageFromRepo(mongoPage);

    if (page != null) pages.push(page);
  }

  return pages;
}

export function transformToPageFromRepo(entryPage: any): Page | null {
  if (!entryPage || (entryPage.hasOwnProperty("_doc") && !entryPage._doc))
    return null;

  const mongoPage = entryPage._doc ? entryPage._doc : entryPage;
  mongoPage.id = mongoPage._id.toString();
  mongoPage.type = mongoPage.__type;

  return createPageFromNonSchemaData(mongoPage);
}
