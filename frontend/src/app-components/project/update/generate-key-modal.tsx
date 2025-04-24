import { generateDeploymentKey } from "@/api/fetch";
import { GenerateDeploymentKeyPayloadModel, ProjectModel } from "@/types";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface GenerateKeyModalProps {
  modalType: "view" | "add";
  projectId?: ProjectModel["id"];
  onClose: () => void;
}

const GenerateKeyModal = (props: GenerateKeyModalProps) => {
  const { modalType, projectId, onClose } = props;

  const [formData, setFormData] = useState<GenerateDeploymentKeyPayloadModel>({
    environment: "Production",
    expired: "",
    projectId: 0,
  });
  const [deploymentKey, setDeploymentKey] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    const { name, value, type } = e.target;
    console.log(
      "\u231B cp-server - handleInputChange - e.target",
      name,
      value,
      type
    );

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      if (!projectId) throw `Project didn't loaded correctly`;
      formData.projectId = projectId;

      generateDeploymentKey(formData).then((res) =>
        setDeploymentKey(res.data.data.key)
      );
    } catch (error) {
      console.error("\u231B cp-server - handleSubmit - error", error);
      toast(`Something wrong! ${error}`);
    }

    // Here you would typically send the data to your backend
    // setModalCtrl({ open: false });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(deploymentKey).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-lg border border-white/10 shadow-xl w-full max-w-md animate-fade-in relative">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-secondary-text hover:text-white"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal header */}
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold">
            {modalType === "view" && "View Project Details"}
            {modalType === "add" && "Add New Update"}
          </h3>
        </div>

        {/* Modal body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Environment Dropdown */}
            <div className="space-y-2">
              <label
                htmlFor="environment"
                className="block text-sm text-secondary-text"
              >
                Environment
              </label>
              <select
                id="environment"
                name="environment"
                value={formData.environment}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-md text-white text-base transition-all focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(78,205,196,0.2)]"
                disabled={modalType === "view"}
              >
                <option className="bg-[#292929]" value="Production">
                  Production
                </option>
                <option className="bg-[#292929]" value="Staging">
                  Staging
                </option>
                <option className="bg-[#292929]" value="Development">
                  Development
                </option>
                <option className="bg-[#292929]" value="Local">
                  Local
                </option>
              </select>
            </div>

            {/* Expiry Date Picker */}
            <div className="space-y-2">
              <label
                htmlFor="expiryDate"
                className="block text-sm text-secondary-text"
              >
                Expiry Date
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expired"
                value={formData.expired}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-md text-white text-base transition-all focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(78,205,196,0.2)]"
                disabled={modalType === "view"}
              />
            </div>

            {/* Submit Button */}
            {modalType !== "view" && (
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-accent text-bg-dark p-3 border-none rounded-md font-semibold cursor-pointer transition-all hover:bg-[#3db9b0]"
                >
                  Add Update
                </button>
              </div>
            )}

            {/* View Mode Close Button */}
            {modalType === "view" && (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-white/10 text-white p-3 border-none rounded-md font-semibold cursor-pointer transition-all hover:bg-white/20"
                >
                  Close
                </button>
              </div>
            )}
          </form>
          {deploymentKey && (
            <div className="flex items-center justify-between bg-white/5 rounded-md mt-10 p-4 border border-white/10">
              <div>
                <h3 className="text-lg font-medium">
                  {deploymentKey || "Deployment Key"}
                </h3>
                {/* <p className="text-secondary-text"></p> */}
              </div>
              <button
                onClick={copyToClipboard}
                className="text-accent hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {copySuccess ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  )}
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateKeyModal;
