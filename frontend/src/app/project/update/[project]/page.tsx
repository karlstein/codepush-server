import React, { Fragment } from "react";
import Header from "@/components/header";
import ProjectUpdateMain from "@/app-components/project/update/main";

export interface UpdateListPageProps {
  params: Promise<{ project: string }>;
}

export default async function UpdateListPage(props0: UpdateListPageProps) {
  return (
    <Fragment>
      <Header />
      <div className="max-w-[1300px] mx-auto mt-10 w-full">
        <ProjectUpdateMain params={props0.params} />
      </div>
    </Fragment>
  );
}
