import React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  colorSchemeDark,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { UpdateModel } from "@/types";

ModuleRegistry.registerModules([AllCommunityModule]);
const myTheme = themeQuartz.withPart(colorSchemeDark);

interface UpdateListProps {
  updates?: UpdateModel[];
}

const UpdateList = (props: UpdateListProps) => {
  const { updates } = props;

  return (
    <div className="flex-1 bg-card-bg border border-white/10 rounded-lg p-4 shadow-lg w-full min-w-[700px]">
      <div className="h-[400px] w-full overflow-y-hidden">
        <AgGridReact
          theme={myTheme}
          rowData={updates || []}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, resizable: true }}
          animateRows={true}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          // domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

const columnDefs: (ColDef<UpdateModel> | ColGroupDef<UpdateModel>)[] = [
  {
    headerName: "No",
    width: 70,
    valueGetter: "node.rowIndex + 1",
  },
  {
    headerName: "Version",
    field: "version",
    width: 200,
    sortable: true,
  },
  {
    headerName: "Platform",
    field: "platform",
    width: 120,
    sortable: true,
    filter: true,
    cellClass: "flex flex-col content-center",
    cellRenderer: (params: { value: string }) => {
      const platformClass =
        params.value === "android"
          ? "bg-green-700/50 text-green-200"
          : "bg-blue-700/50 text-blue-200";
      return (
        <div
          className={`${platformClass} text-xs px-2 py-1 rounded-full text-center w-16`}
        >
          {params.value}
        </div>
      );
    },
  },
  {
    headerName: "Is Mandatory",
    field: "mandatory",
    width: 140,
    cellClass: "flex flex-col content-center",
    cellRenderer: (params: { value: boolean }) => (
      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={params.value}
          className="h-4 w-4 accent-accent"
        />
      </div>
    ),
  },
  {
    headerName: "Created At",
    field: "createdAt",
    width: 180,
    sortable: true,
  },
  {
    headerName: "Environment",
    field: "environment",
    width: 140,
    sortable: true,
    filter: true,
  },
  {
    headerName: "Action",
    width: 120,
    cellClass: "flex flex-col content-center",
    cellRenderer: () => (
      <div className="flex gap-2 justify-center">
        <button className="p-1 text-accent hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button className="p-1 text-error hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    ),
  },
];

export default UpdateList;
