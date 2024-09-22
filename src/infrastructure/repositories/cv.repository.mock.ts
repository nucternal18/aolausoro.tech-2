import type { ResponseProps } from "types/global";
import { injectable } from "inversify";
import type { ICVRepository } from "@src/application/repositories/cv.repository.interface";
import type { PartialCvProps } from "@src/entities/models/cv";

export class MockCVRepository implements ICVRepository {
  private _cvs: PartialCvProps[];

  constructor() {
    this._cvs = [
      {
        id: "1",
        cvUrl: "one",
        createdAt: new Date(),
      },
      {
        id: "2",
        cvUrl: "two",
        createdAt: new Date(),
      },
      {
        id: "3",
        cvUrl: "three",
        createdAt: new Date(),
      },
    ];
  }

  async getCvs(): Promise<PartialCvProps[]> {
    return this._cvs;
  }

  async createCv(
    userId: string,
    input: PartialCvProps,
  ): Promise<ResponseProps> {
    this._cvs.push(input);
    return { success: true, message: "CV created successfully" };
  }
}
