import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Block from "~/components/FlowCreateBlock";
import SetUpIcon from "public/images/icons/record_voice_over.inline.svg";
import CustomInput from "~/components/CustomInput/index2";
import CustomSelect from "~/components/CustomSelect";
import useForm from "~contexts/useFormContext";
import { getPaymentProvidersAPI } from "~/apis/payment";

const SetUpBlock = ({ fRef }) => {
  const {
    register,
    formState: { errors },
    setValue,
    defaultValues,
  } = useForm();
  const [paymentProviders, setPaymentProvider] = useState([]);

  useEffect(() => {
    fetchPaymentProviders();
  }, []);

  const fetchPaymentProviders = async () => {
    const response = await getPaymentProvidersAPI();
    if (response.isSuccess()) {
      setPaymentProvider(response.success());
      if (!defaultValues?.paymentProvider) {
        setValue("paymentProvider", response.success()?.[0]);
      }
    }
  };

  return (
    <Block ref={fRef} title={"Set Up"} icon={SetUpIcon}>
      <div className={"mb-4"}>
        <CustomInput
          weight={"semi-bold"}
          label={"Cancel Flow Name"}
          type={"text"}
          error={errors?.name}
          {...register("name", {
            required: true,
            maxLength: {
              value: 30,
              message: "Flow name must not be longer than 30 characters.",
            },
          })}
        />
      </div>
      <div className={"mb-4"}>
        <CustomInput
          weight={"semi-bold"}
          label={"Flow Description"}
          type={"text"}
          error={errors?.description}
          {...register("description", {
            required: true,
            maxLength: {
              value: 60,
              message: "Description must not be longer than 60 characters.",
            },
          })}
        />
      </div>
      <div className={"mb-4"}>
        <CustomSelect
          label={"Payment Provider"}
          className={"capitalize"}
          error={errors.paymentProvider}
          {...register(`paymentProvider`, { required: true })}
        >
          {paymentProviders.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </CustomSelect>
      </div>
    </Block>
  );
};

SetUpBlock.propTypes = {
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
export default SetUpBlock;
