import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
// import dynamic from 'next/dynamic';
import Block from "~/components/FlowCreateBlock";
import ConfirmationIcon from "public/images/icons/confirmation.inline.svg";
import CustomInput from "~/components/CustomInput/index2";
import useForm from "~contexts/useFormContext";

const ConfirmationBlock = ({ fRef }) => {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <Block ref={fRef} icon={ConfirmationIcon} title={"Confirmation Message"}>
      <div className={"mb-4"}>
        <CustomInput
          label={"Confirmation message Title"}
          type={"text"}
          error={errors?.confirmation?.title}
          {...register("confirmation.title", {
            required: true,
            maxLength: {
              value: 30,
              message: "Title must not be longer than 30 characters.",
            },
          })}
        />
      </div>
      <div>
        <CustomInput
          label={"Description"}
          type={"text"}
          error={errors?.confirmation?.message}
          {...register("confirmation.message", {
            required: true,
            maxLength: {
              value: 60,
              message: "Message must not be longer than 60 characters.",
            },
          })}
        />
      </div>
    </Block>
  );
};

ConfirmationBlock.propTypes = {
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

export default ConfirmationBlock;
