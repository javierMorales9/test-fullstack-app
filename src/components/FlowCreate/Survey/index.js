import React, { useState } from "react";
import PropTypes from "prop-types";
import SurveyIcon from "public/images/icons/check.inline.svg";
import CustomInput from "~/components/CustomInput/index2";
import Button from "~/components/Button";
import Block from "~/components/FlowCreateBlock";
import dynamic from "next/dynamic";
import useForm from "~/contexts/useFormContext";

const DraggableWrapper = dynamic(() => import("./draggable"), {
  ssr: false,
});

const SurveyBlock = ({ surveyOptions, remove, add, move, fRef }) => {
  const {
    register,
    formState: { errors },
  } = useForm();

  const removeSurveyOption = (id) => {
    remove(id);
  };
  const addSurveyOption = () => {
    add();
  };

  return (
    <Block ref={fRef} p0 title={"Survey"} icon={SurveyIcon}>
      <div className="mb-4">
        <CustomInput
          weight={"semi-bold"}
          label={"Survey Title"}
          name={"title"}
          type={"text"}
          error={errors?.surveyDetails?.title}
          {...register("surveyDetails.title", {
            required: true,
            maxLength: {
              value: 30,
              message: "Title must not be longer than 30 characters.",
            },
          })}
        />
      </div>
      <div className="mb-4">
        <CustomInput
          weight={"semi-bold"}
          label={"Subtitle"}
          name={"subtitle"}
          type={"textarea"}
          rows={"4"}
          error={errors?.surveyDetails?.subtitle}
          {...register("surveyDetails.subtitle", {
            required: true,
            maxLength: {
              value: 300,
              message: "Description must not be longer than 300 characters.",
            },
          })}
        />
      </div>
      <label className={"label"}>Options</label>
      <DraggableWrapper
        items={surveyOptions}
        move={move}
        removeItem={removeSurveyOption}
      />
      <div className={"border-t border-grey-3 py-1"}>
        <Button
          type={"button"}
          size={"large"}
          variant={"clean"}
          className={"w-full"}
          onClick={addSurveyOption}
        >
          <span className={"text-primary"}>+ Add another option</span>
        </Button>
      </div>
    </Block>
  );
};

SurveyBlock.propTypes = {
  surveyOptions: PropTypes.array.isRequired,
  add: PropTypes.func.isRequired,
  move: PropTypes.func.isRequired,
  fRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({
      current: PropTypes.instanceOf(
        typeof Element === "undefined" ? function () {} : Element,
      ),
    }),
  ]),
};

export default SurveyBlock;
