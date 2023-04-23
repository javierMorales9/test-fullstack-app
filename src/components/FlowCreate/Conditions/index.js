import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import PropTypes from "prop-types";
import AudienceIcon from "public/images/icons/split.inline.svg";
import Button from "~/components/Button";
import Block from "~/components/FlowCreateBlock";
import Condition from "./Condition";
import { getPlansAPI } from "~/apis/payment";
import useForm from "~/contexts/useFormContext";

const ConditionsBlock = ({ fRef }) => {
  const { control, watch } = useForm();

  const {
    fields: conditionsFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "conditions",
  });

  const paymentProvider = watch("paymentProvider");

  const conditions = conditionsFields.map((field, index) => ({
    ...field,
    ...watch("conditions")[index],
  }));

  const [plans, setPlans] = useState([]);
  const fetchPlans = async () => {
    const response = await getPlansAPI(paymentProvider);
    if (response.isSuccess()) {
      setPlans(response.success());
    }
  };

  useEffect(() => {
    if (paymentProvider) {
      fetchPlans();
    }
  }, [paymentProvider]);

  const removeCondition = (id) => {
    // const allItems = [...conditions];
    // const index = allItems.findIndex((c) => c.id === id);
    // if (index > -1) {
    //   // only splice array when item is found
    //   allItems.splice(index, 1); // 2nd parameter means remove one item only
    //   setConditions(allItems);
    // }
    remove(id);
  };

  const addCondition = () => {
    // const allItems = [...conditions];
    // allItems.push({ id: uuidv4() });
    // setConditions(allItems);
    append();
  };

  return (
    <Block ref={fRef} p0 title={"Audience Conditions"} icon={AudienceIcon}>
      {conditions.map((currentValue, index) => (
        <Condition
          removeCondition={removeCondition}
          id={index}
          key={currentValue.id}
          currentValue={currentValue}
          plans={plans}
        />
      ))}
      <div className={"border-t border-grey-3 py-1"}>
        <Button
          type={"button"}
          size={"large"}
          variant={"clean"}
          className={"w-full"}
          onClick={addCondition}
        >
          <span className={"text-primary"}>+ Add another condition</span>
        </Button>
      </div>
    </Block>
  );
};

ConditionsBlock.propTypes = {
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

export default ConditionsBlock;
