import { ProjectModel } from "@/types";
import Link from "next/link";
import React, { Fragment, ReactNode } from "react";

interface ProjectCardProps {
  leadColor?: string;
  project?: ProjectModel;
  disabled?: boolean;
}

const ProjectCard = (props: ProjectCardProps) => {
  const { leadColor, project, disabled } = props;

  const className = `w-[200px] h-[80px] ${
    leadColor || "bg-card-bg"
  } border border-gray-800 rounded-tl-lg rounded-br-lg flex overflow-hidden shadow-md hover:shadow-lg transition-shadow`;

  const base64Project = Buffer.from(JSON.stringify(project)).toString("base64");
  const renderContainer = (children: ReactNode) => {
    if (disabled) return <div className={className}>{children}</div>;

    return (
      <Link href={`/project/update/${base64Project}`} className={className}>
        {children}
      </Link>
    );
  };

  return renderContainer(
    <Fragment>
      <div className="w-16 h-full bg-accent flex items-center justify-center">
        {project?.imageUrl && (
          <span className="text-2xl">{project?.imageUrl}</span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm">{project?.projectName}</h3>
        {project?.projectDesc && (
          <p className="text-xs text-gray-400">{project?.projectDesc}</p>
        )}
      </div>
    </Fragment>
  );
};

export default ProjectCard;
