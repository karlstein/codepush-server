import { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export type GormModel = {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type LoginModel = {
  user: UserModel;
  provider_access_token: string;
  token?: string;
};

export type LoginResModel = {
  user: UserModel;
  provider_access_token: string;
};

// Update model
export type UpdateModel = GormModel & {
  version: string;
  platform: string;
  environment: string;
  checksum: string;
  fileName: string;
  mandatory: boolean;
  projectId: number;
  project: ProjectModel;
};

// User model
export type UserModel = GormModel & {
  authId: string;
  provider: string;
  email: string;
  Name: string;
  imageUrl: string;
  isSuper: boolean;
};

// Project model
export type ProjectModel = GormModel & {
  projectName: string;
  projectDesc: string;
  imageUrl: string;
};

// Team model
export type TeamModel = GormModel & {
  userId: number;
  user: UserModel;
  projectId: number;
  project: ProjectModel;
};

// Project model
export type DeploymentKeyModel = GormModel & {
  key: string;
  environment: string;
  expired: string;
  userId: number;
  user: UserModel;
  projectId: number;
  project: ProjectModel;
};

export interface SuccessResponseType<T, D = any> extends AxiosResponse {
  data: {
    data: T;
    message?: string;
    status: number;
  };
  config: InternalAxiosRequestConfig<D>;
}

// Project Updates model
export type ProjectUpdatesModel = {
  project: ProjectModel;
  updates: UpdateModel[];
};

export type BaseSearchParamsModel = {
  limit: number;
  page: number;
  keyword?: string;
};

export type ProjectUpdatesParamsModel = BaseSearchParamsModel & {
  projectID: number;
  version?: UpdateModel["version"];
  platform?: UpdateModel["platform"];
  environment?: UpdateModel["environment"];
  checksum?: UpdateModel["checksum"];
  fileName?: UpdateModel["fileName"];
  mandatory?: UpdateModel["mandatory"];
};

export type GenerateDeploymentKeyPayloadModel = Omit<
  DeploymentKeyModel,
  "key" | "userId" | "user" | "project"
>;
