import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Block from "~/components/FlowCreateBlock";
import TextAreaIcon from "public/images/icons/textarea.inline.svg";
import CustomInput from "~/components/CustomInput/index2";
import useForm from "~/contexts/useFormContext";

const TextAreaBlock = ({ fRef, enabledTextArea, setEnabledTextArea }) => {
  const {
    register,
    unregister,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!enabledTextArea) {
      unregister("textarea");
    }
  }, [enabledTextArea]);

  return (
    <Block
      ref={fRef}
      title={"Text Area"}
      icon={TextAreaIcon}
      enabled={enabledTextArea}
      onChange={(e) => {
        setEnabledTextArea(e.currentTarget.checked);
      }}
    >
      {enabledTextArea && (
        <>
          <div className={"mb-4"}>
            <CustomInput
              label={"Title"}
              type={"text"}
              error={errors?.textarea?.title}
              {...register("textarea.title", {
                required: true,
                maxLength: {
                  value: 30,
                  message: "Title must not have more than 30 characters.",
                },
              })}
            />
          </div>
          <div>
            <CustomInput
              label={"Description"}
              type={"text"}
              error={errors?.textarea?.description}
              {...register("textarea.description", {
                required: true,
                maxLength: {
                  value: 60,
                  message: "Description must not be longer than 60 characters",
                },
              })}
            />
          </div>
        </>
      )}
    </Block>
  );
};

TextAreaBlock.propTypes = {
  enabledTextArea: PropTypes.bool.isRequired,
  setEnabledTextArea: PropTypes.func.isRequired,
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

export default TextAreaBlock;
