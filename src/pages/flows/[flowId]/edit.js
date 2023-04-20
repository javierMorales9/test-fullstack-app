import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "~/HOC/withAuth";
import CreateFlowComponent from "~/components/FlowCreate";
import Loader from "~/components/Loader";
import { getFlowAPI } from "~/apis/flow";
import { getAudienceAPI } from "~/apis/audience";
import { getOfferAPI } from "~/apis/offer";
import { OFFER_VALUES } from "~/utils/constants";
import { FormProvider } from "~/contexts/useFormContext";

const EditFlow = () => {
  const router = useRouter();
  const { flowId = "" } = router.query;

  const [loading, setLoading] = useState(true);
  const [flowData, setFlowData] = useState(null);
  const [ids, setIds] = useState(null);
  const [colors, setColors] = useState();

  const fetchAudience = async (audienceId) => {
    const response = await getAudienceAPI(audienceId);
    if (response.isSuccess()) {
      return response.success();
    }
    return { segments: [] };
  };

  const getSurvey = (data) => {
    return data.pages.find((page) => page.type === "survey");
  };

  const getOffers = (data) => {
    return data.pages.find((page) => page.type === "offerpage");
  };

  const getConfirmation = (data) => {
    return data.pages.find((page) => page.type === "cancel");
  };

  const getTextarea = (data) => {
    return data.pages.find((page) => page.type === "textarea");
  };

  const fetchFlow = async () => {
    setLoading(true);
    const response = await getFlowAPI(flowId);
    if (response.isSuccess()) {
      const data = response.success();
      const { name, description, audiences, design, paymentProvider } = data;
      const idsData = { audienceId: audiences?.[0] };
      setIds(idsData);

      if (design) {
        const colorsData = design;
        colorsData["id"] = design._id;
        delete colorsData["_id"];
        setColors(colorsData);
      }

      const surveyData = getSurvey(data);
      const offerData = getOffers(data);
      const confirmation = getConfirmation(data);
      const textarea = getTextarea(data);

      const offerIds = offerData?.maps.map((map) => map.offer);
      let [audienceData, ...offers] = await Promise.all([
        fetchAudience(idsData?.audienceId),
        ...offerIds.map((offerId) => {
          return getOfferAPI(offerId);
        }),
      ]);

      offers = offers
        .map((o) => (o.isSuccess() ? o.success() : {}))
        .reduce((acc, offer) => {
          acc[offer.id] = offer;
          return acc;
        }, {});

      const formData = { name, description, paymentProvider };
      formData["conditions"] = audienceData?.segments.map((segment) => {
        const value = { value: segment.value };
        if (segment.operator === "between") {
          value["value"] = segment.value[0];
          value["value2"] = segment.value[1];
        }
        if (segment.field === "subscriptionStartDate") {
          Object.keys(value).forEach((key) => {
            value[key] = new Date(value[key]).toISOString().substring(0, 10);
          });
        }
        return { ...segment, ...value };
      });
      formData["surveyDetails"] = {
        title: surveyData?.title,
        subtitle: surveyData?.hint,
        options: surveyData?.options.map((value) => {
          const offerId = offerData?.maps?.find((map) =>
            map.surveys.some((s) => s.possibleAnswers.some((v) => v === value)),
          )?.offer;
          const {
            message,
            paymentProviderId: discount,
            maxPauseMonth,
            title,
            type,
            header,
            content,
          } = offers[offerId] || { type: OFFER_VALUES.NOTHING };
          return {
            value,
            offer: {
              id: offerId,
              message,
              discount,
              maxPauseMonth,
              title,
              type,
              header,
              content,
            },
          };
        }),
      };
      formData["confirmation"] = {
        title: confirmation?.title,
        message: confirmation?.message,
      };
      if (textarea) {
        formData["textarea"] = {
          title: textarea?.title,
          description: textarea?.description,
        };
      }
      setFlowData(formData);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (flowId) {
      fetchFlow();
    }
  }, [flowId]);

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <FormProvider defaultValues={flowData}>
      <CreateFlowComponent
        flowId={flowId}
        audienceId={ids?.audienceId}
        defaultColors={colors}
      />
    </FormProvider>
  );
};

EditFlow.propTypes = {};

export default withAuth(EditFlow);
