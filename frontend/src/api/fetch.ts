import {
  DeploymentKeyModel,
  GenerateDeploymentKeyPayloadModel,
  LoginModel,
  ProjectModel,
  ProjectUpdatesModel,
  ProjectUpdatesParamsModel,
  SuccessResponseType,
} from "@/types";
import { httpClient } from "./httpClient";

export const login = (
  payload: LoginModel
): Promise<SuccessResponseType<LoginModel, LoginModel>> =>
  httpClient.post("/login", payload);

export const setCookie = (token: string, hostname: string): Promise<Response> =>
  fetch(`${hostname}/api/set-cookie`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

export const logout = (): Promise<SuccessResponseType<unknown, LoginModel>> =>
  httpClient.post("/logout");

// export const getProjects = (): Promise<
//   SuccessResponseType<ProjectModel[], unknown>
// > => httpClient.get("/auth/project");

export const getProjects = (): Promise<
  SuccessResponseType<ProjectModel[], unknown>
> => httpClient.get("/cred/project");

export const getProjectUpdates = (
  params: ProjectUpdatesParamsModel
): Promise<
  SuccessResponseType<ProjectUpdatesModel, ProjectUpdatesParamsModel>
> => httpClient.get("/cred/project/updates", { params });

export const generateDeploymentKey = (
  payload: GenerateDeploymentKeyPayloadModel
): Promise<
  SuccessResponseType<DeploymentKeyModel, GenerateDeploymentKeyPayloadModel>
> => httpClient.post("/cred/project/generate-key", payload);
