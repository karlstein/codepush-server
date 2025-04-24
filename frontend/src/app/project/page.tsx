import ProjectList from "@/app-components/project/project-list";
import Header from "@/components/header";
import { getCookie } from "@/lib/utils";
import React, { Fragment } from "react";

const Project = async () => {
  const authToken = await getCookie("auth_token");
  const hostname = await getCookie("hostname");

  return (
    <Fragment>
      <Header authTokenCookie={authToken} hostnameCookie={hostname} />

      <section
        id="home"
        className="min-h-screen pt-10 px-6 flex justify-center w-full"
      >
        <ProjectList />
      </section>
    </Fragment>
  );
};

export default Project;
