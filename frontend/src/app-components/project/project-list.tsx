"use client";

import { getProjects } from "@/api/fetch";
import { ProjectModel } from "@/types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProjectCard from "./project.card";

const ProjectList = () => {
  const [data, setData] = useState<ProjectModel[]>([]);

  useEffect(() => {
    getProjects()
      .then((res) => {
        setData(res.data.data);
      })
      .catch((error) => {
        toast(typeof error === "string" ? error : "Something wrong", {
          type: "error",
        });
        console.error("cp-server - getData", error);
        setData([]);
      });
  }, []);

  return (
    <div className="max-w-6xl w-full">
      {/* <!-- Card Grid Section --> */}
      <div className="mt-1 w-full">
        <h2 className="text-3xl font-bold mb-4 relative inline-block">
          <span className="relative z-5">Projects</span>
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent opacity-20 rounded-md -z-10"></span>
        </h2>

        <div className="flex flex-wrap gap-6 w-full h-[75vh] overflow-y-auto px-0 py-4 scrollbar">
          {data.map((e) => (
            <ProjectCard key={e.id} project={e} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
