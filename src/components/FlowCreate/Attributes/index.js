import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Block from "~/components/FlowCreateBlock";
import CustomInput from "~/components/CustomInput/index2";
import Button from "~/components/Button";
import AttributesIcon from "public/images/icons/attributes.svg";
import CloseIcon from "public/images/icons/close.svg";
import styles from "./Attribute.module.css";
import { useFieldArray } from "react-hook-form";
import useForm from "~/contexts/useFormContext";

const AttributesBlock = () => {
  const { register, watch, control } = useForm();

  const {
    fields: attributesFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "attributes",
  });

  const attributes = attributesFields.map((field, index) => ({
    ...field,
    ...watch("attributes")[index],
  }));

  const removeAttribute = (id) => {
    remove(id);
  };

  const addAttribute = () => {
    append();
  };

  return (
    <Block p0 icon={AttributesIcon} iconWidth={16} title={"Custom attributes"}>
      <label className={"label flex items-center justify-between"}>
        Add some custom attributes
        <a href="#" className={`link ${styles.link}`}>
          + More info
        </a>
      </label>
      <div className={styles.attributesWrapper}>
        {attributes.map(({ id }, index) => (
          <div key={id} className={styles.attribute}>
            <CustomInput
              weight={"semi-bold"}
              type={"text"}
              placeholder={"Key"}
              {...register(`attributes.${index}.key`, {
                required: true,
              })}
            />
            <CustomInput
              weight={"semi-bold"}
              type={"text"}
              placeholder={"Value"}
              {...register(`attributes.${index}.value`, {
                required: true,
              })}
            />
            <Button
              type={"button"}
              variant={"clean"}
              className={styles.remove}
              onClick={() => removeAttribute(id)}
            >
              <Image src={CloseIcon} />
            </Button>
          </div>
        ))}
      </div>
      <div className={"border-t border-grey-3 py-1"}>
        <Button
          type={"button"}
          size={"large"}
          variant={"clean"}
          className={"w-full"}
          onClick={addAttribute}
        >
          <span className={"text-primary"}>+ Add another attribute</span>
        </Button>
      </div>
    </Block>
  );
};

AttributesBlock.propTypes = {};

export default AttributesBlock;
