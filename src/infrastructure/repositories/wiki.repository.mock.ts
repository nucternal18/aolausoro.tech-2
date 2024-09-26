import type { ResponseProps } from "types/global";
import type { IWikiRepository } from "@src/application/repositories/wiki.repository.interface";
import type { PartialWikiProps } from "@src/entities/models/Wiki";

// @injectable()
export class MockWikiRepository implements IWikiRepository {
  private _wikis: PartialWikiProps[];

  constructor() {
    this._wikis = [
      {
        id: "1",
        title: "one",
        imageUrl: "https://via.placeholder.com/150",
        description: "description one",
        isImage: true,
        userId: "1",
      },
      {
        id: "2",
        title: "two",
        imageUrl: "https://via.placeholder.com/150",
        description: "description two",
        isImage: true,
        userId: "2",
      },
      {
        id: "3",
        title: "three",
        imageUrl: "https://via.placeholder.com/150",
        description: "description three",
        isImage: true,
        userId: "3",
      },
    ];
  }

  async getWiki(): Promise<PartialWikiProps[] | undefined> {
    return this._wikis;
  }

  async getWikiById(id: string): Promise<PartialWikiProps | undefined> {
    const wiki = this._wikis.find((u) => u.id === id);
    return wiki;
  }

  async createWiki(input: PartialWikiProps): Promise<ResponseProps> {
    this._wikis.push(input);
    return { success: true, message: "Wiki created successfully" };
  }

  async updateWiki(input: PartialWikiProps): Promise<ResponseProps> {
    const index = this._wikis.findIndex((u) => u.id === input.id);
    this._wikis[index] = input;
    return { success: true, message: "Wiki updated successfully" };
  }

  async deleteWiki(id: string): Promise<ResponseProps> {
    const index = this._wikis.findIndex((u) => u.id === id);
    this._wikis.splice(index, 1);
    return { success: true, message: "Wiki deleted successfully" };
  }
}
