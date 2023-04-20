import React from "react";
import Icon from "~/components/Icon";
import PCIcon from "public/images/icons/pc.svg";
import Input from "~/components/CustomInput";
import { useFormContext, useFieldArray } from "react-hook-form";
import CloseIcon from "public/images/icons/close.svg";

export default function SurveyQuestionForm({ questionType, index }) {
  const { register, control } = useFormContext();

  const selector = `questions.${index}`;

  const {
    fields: options,
    append,
    remove,
  } = useFieldArray({
    name: `${selector}.options`,
    control: control,
  });
  function addOption() {
    append("");
  }

  function removeOption(_index) {
    remove(_index);
  }
  console.log("Rendering this this");
  return (
    <>
      <div>
        {questionType !== "cta" ? (
          <Input
            {...register(`${selector}.question`)}
            // @ts-ignore
            label="Question Headline"
          />
        ) : (
          <Input
            // @ts-ignore
            label="Question Headline"
            {...register(`${selector}.headline`)}
          />
        )}
        <Input
          {...register(`${selector}.explanation`)}
          // @ts-ignore
          label="Explanation Text"
          type="textarea"
        />
        {/* @ts-ignore */}
        <Input {...register(`${selector}.slug`)} label="Slug" />
        {questionType === "cta" && (
          // @ts-ignore
          <Input {...register(`${selector}.linkUrl`)} label="Target URL" />
        )}
        {questionType === "cta" && (
          <Input
            {...register(`${selector}.linkText`)}
            // @ts-ignore
            label="Call to Action Text"
            type="text"
          />
        )}
        {questionType === "select" && (
          <div>
            <p className="text-black-3 my-2 text-sm font-medium">Options</p>
            {options &&
              options.map((op, _index) => (
                <div className="mb-4 flex w-full" key={op.id}>
                  <div className="mr-4 flex-1">
                    <Input {...register(`${selector}.options.${_index}`, {})} />
                  </div>
                  <button
                    className="ml-auto"
                    onClick={() => removeOption(_index)}
                  >
                    <CloseIcon className="w-4" />
                  </button>
                </div>
              ))}

            <button onClick={addOption}>+ Add Option</button>
          </div>
        )}
      </div>
      {/* TODO: Investigate why it leaves focus after first character */}
    </>
  );
}
