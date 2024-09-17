import type { PartialWikiProps } from "@src/entities/models/Wiki";

export type ResponseProps = {
  success: boolean;
  message: string;
};

export interface IWikiRepository {
  getWiki(): Promise<PartialWikiProps[] | undefined>;
  getWikiById(id: string): Promise<PartialWikiProps | undefined>;
  createWiki(input: PartialWikiProps): Promise<ResponseProps>;
  updateWiki(input: PartialWikiProps): Promise<ResponseProps>;
  deleteWiki(id: string): Promise<ResponseProps>;
}
