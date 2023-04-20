import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useForm as hookForm } from "react-hook-form";
import { OFFER_VALUES } from "~/utils/constants";

const FormContext = React.createContext({});

export const FormProvider = ({ children, defaultValues }) => {
  const formData = hookForm({
    defaultValues,
  });

  return (
    <FormContext.Provider value={{ ...formData, defaultValues }}>
      {children}
    </FormContext.Provider>
  );
};

FormProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  defaultValues: PropTypes.object,
};

FormProvider.defaultProps = {
  defaultValues: {
    conditions: [{}],
    surveyDetails: {
      title: "What can we do better?",
      subtitle:
        "We would like to know your opinion to improve our product. Tell us the reason you want to cancel your subscription",
      options: [
        { value: "Budget", offer: { type: OFFER_VALUES.NOTHING } },
        { value: "Technical Issues", offer: { type: OFFER_VALUES.NOTHING } },
        {
          value: "I'm not going to use it in a few months",
          offer: { type: OFFER_VALUES.NOTHING },
        },
        { value: "Other", offer: { type: OFFER_VALUES.NOTHING } },
      ],
    },
    confirmation: {
      title: "Are you sure you want to cancel?",
      message: "Are you sure you wan to cancel the subscription?",
    },
    textarea: {
      title: "Are you sure that you want to cancel?",
      description:
        "In case you are finally leaving, we hope to see you in the future again. Thanks for your feedback",
    },
  },
};

const useForm = () => useContext(FormContext);

export default useForm;
