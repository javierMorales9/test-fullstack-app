import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Block from "~/components/FlowCreateBlock";
import OfferIcon from "public/images/icons/offer.inline.svg";
import Offer from "./Offer";
import useForm from "~contexts/useFormContext";
import { getCouponsAPI } from "~/apis/offer";

const OfferBlock = ({ surveyOptions, fRef }) => {
  const { watch } = useForm();
  const paymentProvider = watch("paymentProvider");
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    const response = await getCouponsAPI(paymentProvider);
    if (response.isSuccess()) {
      setCoupons(response.success());
    }
  };

  useEffect(() => {
    if (paymentProvider) {
      fetchCoupons();
    }
  }, [paymentProvider]);

  const discountOptions = coupons.map((coupon) => ({
    value: coupon.id,
    label: (
      <>
        {coupon.name}:{" "}
        <span className={"text-primary font-normal"}>{coupon.id}</span>
      </>
    ),
  }));

  return (
    <Block ref={fRef} p0 title={"Offers"} icon={OfferIcon}>
      {surveyOptions.map((survey, index) => (
        <Offer
          key={survey.id}
          surveyIndex={index}
          survey={survey}
          discountOptions={discountOptions}
        />
      ))}
    </Block>
  );
};

OfferBlock.propTypes = {
  surveyOptions: PropTypes.array.isRequired,
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

export default OfferBlock;
