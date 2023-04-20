import React from "react";
import Button from "~/components/Button";
import Icon from "~/components/Icon";
import ActiveSurveyIcon from "public/images/icons/active_survey.svg";
import PausedSurveyIcon from "public/images/icons/paused_survey.svg";
import DashboardSurveyIcon from "public/images/icons/dashboard_survey.svg";
import OptionsSurveyIcon from "public/images/icons/options_survey.svg";
import ResponseSurveyIcon from "public/images/icons/response_survey.svg";
import { Survey } from "~/utils/types";
import routes from "~/utils/routes";
import Link from "next/link";

export default function SurveyDisplay({ survey }: { survey: Survey }) {
  return (
    <div>
      <div className=" rounded-tl-md rounded-tr-md border-t border-l border-r border-b bg-white">
        <div className="justify-left mx-6 my-4 flex text-lg font-bold hover:cursor-pointer">
          <Link href={routes.surveyDetail(survey.id)}>
            <span>{survey.name}</span>
          </Link>
        </div>
      </div>

      <div
        className="flex content-between text-lg"
        style={{
          color: "#A5A5A5",
        }}
      >
        <div className="border-1 bg-grey-5 flex grow content-between items-center rounded-bl-md border-b border-l py-4 px-10">
          <div>
            <span className="ml-auto flex content-between">
              <p className="text-black-4 mr-2 text-[18px] font-medium">1</p>
              <Icon IconSource={ResponseSurveyIcon} DecorationClass={""} />
            </span>
          </div>
        </div>
        <div className="border-1 bg-grey-5 flex content-between border-r border-l border-b py-4 px-6">
          <span className="ml-auto">
            <Icon IconSource={DashboardSurveyIcon} DecorationClass={""} />
          </span>
        </div>
        <div className="border-1 bg-grey-5 flex content-between border-r border-b py-4 px-6">
          <span className="ml-auto">
            <Icon IconSource={OptionsSurveyIcon} DecorationClass={""} />
          </span>
        </div>
        <div className="border-1 bg-green-3 flex content-between rounded-br-md border-r border-b py-4 px-6">
          <span className="ml-auto">
            <Icon IconSource={ActiveSurveyIcon} DecorationClass={""} />
            {/* PausedSurveyIcon */}
          </span>
        </div>
      </div>
    </div>
  );
}
