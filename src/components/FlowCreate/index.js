import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import router from "next/router";
import routes from "~/utils/routes";
import { useFieldArray } from "react-hook-form";
import TopBar from "~/components/Navigation/TopBar";
import SetUpBlock from "~/components/FlowCreate/SetUp";
import DesignBlock from "~/components/FlowCreate/Design";
import ConditionsBlock from "~/components/FlowCreate/Conditions";
import SurveyBlock from "~/components/FlowCreate/Survey";
import OfferBlock from "~/components/FlowCreate/Offer";
import TextAreaBlock from "~/components/FlowCreate/TextArea";
import ConfirmationBlock from "~/components/FlowCreate/Confirmation";
import TickIcon from "public/images/icons/tick.svg";
import AlertIcon from "public/images/icons/alert.inline.svg";
import Modal from "~/components/FlowCreate/Modal";
import Button from "~/components/Button";
import { useInView } from "react-intersection-observer";
import { h2, wrapper } from "~/styles/styles.module.css";
import { createAudienceAPI } from "~/apis/audience";
import { createOfferAPI } from "~/apis/offer";
import { addDesignAPI, createFlowAPI } from "~/apis/flow";
import { v4 as uuidv4 } from "uuid";
import { OFFER_VALUES } from "~/utils/constants";
import { toast } from "react-toastify";
import useUser from "~contexts/userContext";
import useForm from "~contexts/useFormContext";
import styles from "./create.module.css";

const CreateFlowComponent = ({ flowId, audienceId, defaultColors }) => {
  const { control, handleSubmit, watch, defaultValues } = useForm();

  const { accountData } = useUser();
  const offerRef = useRef();
  const [offerInView, setOfferInView] = useState(0);
  const [loading, setLoading] = useState(false);

  const [enabledTextArea, setEnabledTextArea] = useState(
    !!defaultValues?.textarea,
  );

  const {
    fields: surveyOptionsFields,
    append: addSurveyOption,
    remove: removeSurveyOption,
    move: moveSurveyOption,
  } = useFieldArray({
    control,
    name: "surveyDetails.options",
  });
  const surveyDetails = {
    ...watch("surveyDetails"),
    options: surveyOptionsFields.map((field, index) => ({
      ...field,
      ...watch("surveyDetails.options")[index],
    })),
  };
  const surveyOptions = surveyDetails.options;

  const confirmationDetails = {
    ...watch("confirmation"),
  };
  const textAreaDetails = {
    ...watch("textarea"),
  };

  const { ref: setUpRef, inView: setUpInView } = useInView({
    /* Optional options */
    threshold: 1,
  });
  // const { ref: designRef, inView: designInView } = useInView({
  //   /* Optional options */
  //   threshold: 1,
  // });
  const { ref: conditionsRef, inView: conditionsInView } = useInView({
    /* Optional options */
    threshold: 0.5,
  });
  const { ref: surveyRef, inView: surveyInView } = useInView({
    /* Optional options */
    threshold: 0.5,
  });
  // const { ref: offerRef, inView: offerInView } = useInView({
  //   /* Optional options */
  //   threshold: surveyOptions.map((option, index) =>
  //     surveyOptions.length === 1 ? 0.1 : index / surveyOptions.length,
  //   ),
  // });
  const { ref: confirmationRef, inView: confirmationInView } = useInView({
    /* Optional options */
    threshold: 1,
  });

  const { ref: textAreaRef, inView: textAreaInView } = useInView({
    /* Optional options */
    threshold: 1,
  });

  const viewPortEntry = 3 / 4; // 75%

  const onScroll = () => {
    const scrollTop = offerRef?.current?.getBoundingClientRect().top;
    const elementHeight = offerRef?.current?.clientHeight;

    const height = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0,
    );

    const intersection = scrollTop - height * viewPortEntry;

    if (intersection <= 0 && intersection >= -1 * elementHeight) {
      setOfferInView(-1 * intersection);
    } else {
      setOfferInView(0);
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  const [colors, setColors] = useState(defaultColors);

  const createAudience = async (data) => {
    const segments = data.conditions.map((s) => {
      if (s.value2) {
        s.value = [s.value, s.value2];
      }
      return s;
    });
    return await createAudienceAPI({
      id: audienceId,
      name: "audience",
      segments,
    });
  };

  const createOffer = async (data) => {
    const offers = data.surveyDetails.options
      .filter(({ offer }) => offer.type !== OFFER_VALUES.NOTHING)
      .map(({ option_id, offer }) => ({ option_id, ...offer }));
    return await Promise.all(
      offers.map(
        ({
          option_id,
          id,
          type,
          title,
          message,
          maxPauseMonth,
          discount,
          header,
          content,
        }) => {
          return createOfferAPI({
            id,
            type,
            title,
            header,
            message,
            maxPauseMonth,
            paymentProviderId: discount,
            content,
          }).then((response) => ({ option_id, response }));
        },
      ),
    );
  };

  const createFlow = async (data, audiences, offers) => {
    const { surveyDetails } = data;

    const pages = [];

    let order = 1;

    // Survey Page
    const surveyId = uuidv4();
    const surveyPage = {
      type: "survey",
      id: surveyId,
      title: surveyDetails.title,
      hint: surveyDetails.subtitle,
      options: surveyDetails.options.map((o) => o.value),
      order,
    };
    pages.push(surveyPage);

    order += 1;

    // Offer Page
    const offerPage = {
      type: "offerpage",
      maps: surveyDetails.options
        .filter((s) => s.offer.type !== OFFER_VALUES.NOTHING)
        .map((s) => {
          return {
            surveys: [
              {
                survey: surveyId,
                possibleAnswers: [s.value],
              },
            ],
            audiences: [],
            offer: offers.find((offer) => offer.option_id === s.option_id)?.id,
          };
        }),
      order: order,
    };
    pages.push(offerPage);

    order += 1;

    // Textarea Page
    if (enabledTextArea) {
      const textareaPage = {
        type: "textarea",
        title: data.textarea.title,
        description: data.textarea.description,
        order,
      };

      pages.push(textareaPage);

      order += 1;
    }
    // Cancel Page
    pages.push({
      type: "cancel",
      title: data.confirmation.title,
      message: data.confirmation.message,
      order,
    });

    order += 1;

    pages.push({
      type: "final",
      order,
    });
    const payload = {
      id: data?.id,
      name: data.name,
      description: data.description,
      pages,
      audiences: [audiences.id],
      paymentProvider: data.paymentProvider,
    };
    return createFlowAPI(payload);
  };

  const handleFlowCreate = async (data) => {
    if (!accountData?.paymentType) {
      toast.error("Payment credentials are required to create a flow");
      return;
    }
    setLoading(true);
    if (flowId) {
      data["id"] = flowId;
    }
    const audiences = await createAudience(data);
    let error = "";
    if (audiences.isSuccess()) {
      const offers = await createOffer(data);
      if (!offers.some((o) => o.response.isFail())) {
        const response = await createFlow(
          data,
          audiences.success(),
          offers.map((o) => ({
            option_id: o.option_id,
            ...o.response.success(),
          })),
        );
        if (response.isSuccess()) {
          const { id } = response.success();
          const r = await addDesignAPI(id, colors);
          if (r.isSuccess()) {
            toast.success(flowId ? "Flow Updated" : "Flow Created");
            router.push(routes.flows);
          } else {
            error = r.fail()?.data?.error;
          }
        } else {
          error = response.fail()?.data?.error;
        }
      } else {
        const errorOffer = offers.find((o) => o.response.isFail());
        error = errorOffer?.response?.fail()?.data?.error;
      }
    } else {
      error = audiences.fail()?.data?.error;
    }
    if (error) {
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      <TopBar active={"flows"} />
      <div className={wrapper}>
        <h2 className={h2}>{flowId ? "Edit Flow" : "Create a new Flow"}</h2>
        <div className={styles.contentWrapper}>
          <div>
            {!accountData?.paymentType && (
              <div className={styles.topError}>
                <AlertIcon className={styles.alertIcon} />
                Payment credentials are required to {flowId
                  ? "edit"
                  : `create`}{" "}
                a flow
              </div>
            )}
            <form onSubmit={handleSubmit(handleFlowCreate)}>
              <SetUpBlock fRef={setUpRef} />
              <DesignBlock colors={colors} setColors={setColors} />
              <ConditionsBlock fRef={conditionsRef} />
              <SurveyBlock
                fRef={surveyRef}
                move={moveSurveyOption}
                remove={removeSurveyOption}
                add={addSurveyOption}
                surveyOptions={surveyOptions}
              />
              <OfferBlock fRef={offerRef} surveyOptions={surveyOptions} />
              <TextAreaBlock
                fRef={textAreaRef}
                enabledTextArea={enabledTextArea}
                setEnabledTextArea={setEnabledTextArea}
              />
              <ConfirmationBlock fRef={confirmationRef} />
              {/*<AttributesBlock />*/}
              <Button
                type={"submit"}
                icon={TickIcon}
                variant={"primary"}
                size={"large"}
                className={styles.btnCreate}
                disabled={loading}
                loading={loading}
              >
                {flowId ? "Save Flow" : "Activate Flow"}
              </Button>
            </form>
          </div>
          <div className={"relative"}>
            <div className={styles.modalWrapper}>
              <Modal
                colors={colors}
                offerRef={offerRef}
                surveyDetails={surveyDetails}
                confirmationDetails={confirmationDetails}
                textAreaDetails={textAreaDetails}
                blocksInView={{
                  setUpInView,
                  // designInView,
                  conditionsInView,
                  surveyInView,
                  offerInView,
                  confirmationInView,
                  textAreaInView: enabledTextArea && textAreaInView,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

CreateFlowComponent.propTypes = {
  flowId: PropTypes.string,
  audienceId: PropTypes.string,
  defaultColors: PropTypes.object,
};

CreateFlowComponent.defaultProps = {
  defaultColors: {
    buttonColor: "#E79E34",
    buttonTextColor: "#FBFAFC",
    acceptButtonTextColor: "#00A5FF",
    wrongAnswerButtonTextColor: "#FC3400",
    mainTitleColor: "#2E2C34",
    descriptionTextColor: "#84818A",
    subtitleTextColor: "#504F54",
    surveyOptionsColor: "#2E2C34",
    surveyBoxColor: "#FBFAFC",
  },
};

export default CreateFlowComponent;
