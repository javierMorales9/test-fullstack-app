import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useController, Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import CustomSelect from "~/components/CustomSelect";
import CustomInput from "~/components/CustomInput/index2";
import Select, { components } from "react-select";
import CaretIcon from "public/images/icons/caret.inline.svg";
import "react-quill/dist/quill.snow.css";
import useForm from "~contexts/useFormContext";
import { OFFER_VALUES } from "~/utils/constants";
import styles from "./Offer.module.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const offers = [
  { id: 1, value: OFFER_VALUES.COUPON, label: "Apply Stripe Discount" },
  { id: 2, value: OFFER_VALUES.PAUSE, label: "Apply Stripe Pause" },
  { id: 3, value: OFFER_VALUES.CUSTOM, label: "Show custom Content" },
  { id: 4, value: OFFER_VALUES.NOTHING, label: "Do nothing" },
];

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretIcon />
    </components.DropdownIndicator>
  );
};

const Offer = ({ survey, surveyIndex, discountOptions }) => {
  const {
    register,
    unregister,
    control,
    formState: { errors },
  } = useForm();

  const { value, offer, option_id: surveyId } = survey;

  useEffect(() => {
    if (offer?.type !== OFFER_VALUES.COUPON) {
      unregister(`surveyDetails.options.${surveyIndex}.offer.discount`);
      unregister(`surveyDetails.options.${surveyIndex}.offer.header`);
    }
    if (offer?.type !== OFFER_VALUES.PAUSE) {
      unregister(`surveyDetails.options.${surveyIndex}.offer.maxPauseMonth`);
    }
    if (offer?.type !== OFFER_VALUES.CUSTOM) {
      unregister(`surveyDetails.options.${surveyIndex}.offer.content`);
    }
  }, [offer]);

  return (
    <>
      <div className={styles.answer} id={`answer-${surveyId}`}>
        <div>
          <label className={styles.label} htmlFor=""></label>
          <CustomSelect
            label={
              <span className={styles.label}>
                Answering &gt; <span>{value}</span>
              </span>
            }
            className={styles.select}
            {...register(`surveyDetails.options.${surveyIndex}.offer.type`, {
              required: true,
            })}
          >
            <option disabled value={""} hidden>
              Selecciona una opción...
            </option>
            {offers.map((f) => (
              <option key={f.id} value={f.value}>
                {f.label}
              </option>
            ))}
          </CustomSelect>
        </div>
        {[
          OFFER_VALUES.COUPON,
          OFFER_VALUES.PAUSE,
          OFFER_VALUES.CUSTOM,
        ].includes(offer?.type) && (
          <div className={"mt-6"}>
            <CustomInput
              label={"Title"}
              error={
                errors?.surveyDetails?.options?.[surveyIndex]?.offer?.title
              }
              {...register(`surveyDetails.options.${surveyIndex}.offer.title`, {
                required: true,
                maxLength: {
                  value: 30,
                  message: "Title must not be longer than 30 characters.",
                },
              })}
            />
          </div>
        )}
        {offer?.type === OFFER_VALUES.COUPON && (
          <>
            <div className={"mt-6"}>
              <CustomInput
                label={"Header"}
                error={
                  errors?.surveyDetails?.options?.[surveyIndex]?.offer?.header
                }
                {...register(
                  `surveyDetails.options.${surveyIndex}.offer.header`,
                  {
                    required: true,
                    maxLength: {
                      value: 45,
                      message: "Header must not be longer than 45 characters.",
                    },
                  },
                )}
              />
            </div>
            <div className={"mt-6"}>
              <CustomInput
                label={"Main message"}
                error={
                  errors?.surveyDetails?.options?.[surveyIndex]?.offer?.message
                }
                {...register(
                  `surveyDetails.options.${surveyIndex}.offer.message`,
                  {
                    required: true,
                    maxLength: {
                      value: 60,
                      message:
                        "Main message must not be longer than 60 characters.",
                    },
                  },
                )}
              />
            </div>
            <div className={"mt-6"}>
              <Controller
                control={control}
                name={`surveyDetails.options.${surveyIndex}.offer.discount`}
                rules={{ required: true }}
                render={({ field: { onChange, value, name, ref } }) => (
                  <Select
                    inputRef={ref}
                    name={name}
                    components={{ DropdownIndicator }}
                    className={styles.reactSelect}
                    placeholder={"Selecciona una opción..."}
                    value={discountOptions.find((o) => o.value === value)}
                    options={discountOptions}
                    onChange={(selectedOption) => {
                      onChange(selectedOption.value);
                    }}
                  />
                )}
              />
              {errors?.surveyDetails?.options?.[surveyIndex]?.offer
                ?.discount && (
                <span className={"input-error"}>
                  {errors?.surveyDetails?.options?.[surveyIndex]?.offer
                    ?.discount?.message || "This field is required"}
                </span>
              )}
            </div>
          </>
        )}
        {offer?.type === OFFER_VALUES.PAUSE && (
          <>
            <div className={"mt-6"}>
              <CustomInput
                label={"Description"}
                error={
                  errors?.surveyDetails?.options?.[surveyIndex]?.offer?.message
                }
                {...register(
                  `surveyDetails.options.${surveyIndex}.offer.message`,
                  {
                    required: true,
                    maxLength: {
                      value: 60,
                      message:
                        "Description must not be longer than 60 characters.",
                    },
                  },
                )}
              />
            </div>
            <div className={"mt-6"}>
              <CustomInput
                rootClass={styles.squareInput}
                className={styles.input}
                defaultValue={1}
                min={1}
                max={99}
                type={"number"}
                label={"Allow subscriptions to pause up to…"}
                helperText={"months"}
                {...register(
                  `surveyDetails.options.${surveyIndex}.offer.maxPauseMonth`,
                  {
                    required: true,
                    valueAsNumber: true,
                  },
                )}
              />
            </div>
          </>
        )}
        {offer?.type === OFFER_VALUES.CUSTOM && (
          <>
            <div className={"mt-6"}>
              {/*<CustomInput*/}
              {/*  label={'Content'}*/}
              {/*  {...register(*/}
              {/*    `surveyDetails.options.${surveyIndex}.offer.message`,*/}
              {/*    {*/}
              {/*      required: true,*/}
              {/*    },*/}
              {/*  )}*/}
              {/*/>*/}
              <label className={"label"}>Content</label>
              <Controller
                control={control}
                name={`surveyDetails.options.${surveyIndex}.offer.content`}
                rules={{
                  required: true,
                  maxLength: {
                    value: 300,
                    message: "Content must not be longer than 300 characters.",
                  },
                }}
                render={({ field }) => (
                  <ReactQuill
                    row
                    className={styles.editor}
                    {...field}
                    theme="snow"
                  />
                )}
              />
              {errors?.surveyDetails?.options?.[surveyIndex]?.offer
                ?.content && (
                <span className={"input-error"}>
                  {errors?.surveyDetails?.options?.[surveyIndex]?.offer?.content
                    ?.message || "This field is required"}
                </span>
              )}
            </div>
          </>
        )}
      </div>
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none;
          padding: 0;
          margin-bottom: 8px;
          //border-color: var(--clickout-color-grey-3);
        }
        .ql-container.ql-snow,
        .ql-toolbar.ql-snow + .ql-container.ql-snow {
          border: 1px solid var(--clickout-color-grey-3);
          border-radius: 4px;
        }
        .ql-editor {
          padding: 13px 15px;
          min-height: 100px;
        }
      `}</style>
    </>
  );
};

Offer.propTypes = {
  survey: PropTypes.object,
  surveyIndex: PropTypes.number,
  discountOptions: PropTypes.array,
};

export default Offer;
