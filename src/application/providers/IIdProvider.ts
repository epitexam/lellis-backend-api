import { UserId } from "../../domain/user/valueObjects/UserId";

export interface IIdProvider {
  generate(): UserId;
}