import React from "react";
import PropTypes from "prop-types";
import { OFFER_VALUES } from "~/utils/constants";
import useUser from "~contexts/userContext";

const closeIconUrl = "/images/icons/close.svg";
const caretIconUrl = "/images/icons/caret.inline.svg";
const pauseIconUrl = "/images/icons/pause.svg";
const starIconUrl = "/images/icons/star.svg";
const logoUrl = "/images/logo-grey.png";

const Modal = ({
  colors,
  surveyDetails,
  blocksInView,
  offerRef,
  textAreaDetails,
  confirmationDetails,
}) => {
  const { accountData } = useUser();

  const getActiveBlock = () => {
    if (blocksInView?.confirmationInView) return "confirmation";
    if (blocksInView?.textAreaInView) return "textarea";
    if (blocksInView?.offerInView) return "offer";
    if (blocksInView?.surveyInView) return "survey";
    if (blocksInView?.conditionsInView) return "survey";
    if (blocksInView?.setUpInView) return "setup";
    return "setup";
  };
  const initial = getActiveBlock() === "setup";
  const survey = getActiveBlock() === "survey";
  const coupon = getActiveBlock() === "offer";
  const pause = getActiveBlock() === "conditions";
  const cancel = getActiveBlock() === "confirmation";
  const textarea = getActiveBlock() === "textarea";
  const confirm = false;

  const totalOffers = surveyDetails.options?.length || 1;

  const offerInView = () => {
    const elementHeight = offerRef?.current?.clientHeight;
    // const k = 81;
    //498
    //453
    //139
    const perOfferHeight = elementHeight / totalOffers;

    if (!blocksInView?.offerInView) {
      return false;
    }
    let height = 81;
    const offerHeights = surveyDetails.options.map((option, index) => {
      height +=
        document.getElementById(`answer-${option.option_id}`)?.clientHeight ||
        0;
      // if (option.offer.type === OFFER_VALUES.COUPON) {
      //   height += 498;
      // }
      // if (option.offer.type === OFFER_VALUES.PAUSE) {
      //   height += 453;
      // }
      // if (option.offer.type === OFFER_VALUES.NOTHING) {
      //   height += 453;
      // }
      // // if (option.of  fer.type === OFFER_VALUES.CUSTOM) {
      // //   height += 453;
      // // }
      return height;
    });

    const index = offerHeights.findIndex((h) => blocksInView?.offerInView <= h);
    // console.log(
    //   blocksInView?.offerInView,
    //   offerHeights.join(' '),
    //   elementHeight,
    //   index,
    // );

    return surveyDetails.options[
      index !== -1 ? index : surveyDetails.options.length - 1
    ]?.offer;

    // return surveyDetails.options.find(
    //   (option, index) =>
    //     blocksInView?.offerInView <= (index + 1) * perOfferHeight,
    // )?.offer;
  };

  const offerType = offerInView() && offerInView()?.type;

  const offerTitle =
    offerInView() &&
    (offerInView()?.title ||
      (offerType === "coupon"
        ? "Wait! Before you go"
        : "Want to take a break?"));

  const offerMessage =
    offerInView() &&
    (offerInView()?.message ||
      (offerType === "coupon"
        ? `for the next two months we offer`
        : `Hi, Do you now you can pause your subscription before cancelling
              it and you won’t loose any data?`));

  return (
    <>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__header__title modal__text-title">
            {initial && "Welcome to the offboarding flow"}
            {survey && (surveyDetails?.title || "What can we do better?")}
            {offerTitle}
            {textarea &&
              (textAreaDetails.title ||
                "Are you sure that you want to cancel?")}
            {cancel && confirmationDetails.title}
            {confirm && "Thanks for completing the form"}
          </h2>
          <button className="modal__header__btn-close">
            <span className={"icon icon-close"}>
              <img src={closeIconUrl} alt="" />
            </span>
          </button>
        </div>
        <div className={"modal__body"}>
          {/* Step initial */}
          {initial && (
            <>
              <div className={"modal__company"}>
                {accountData?.imageUrl && (
                  <img src={accountData?.imageUrl} alt="" />
                )}
              </div>
              <p className={"modal__info"}>
                Before you go, we want to get some information so we can improve
                our product.
              </p>
            </>
          )}
          {/* Step Survey*/}
          {survey && (
            <>
              <p className={"modal__info"}>
                {surveyDetails?.subtitle ||
                  "We would like to know your opinion to improve our product. Tell us the reason you want to cancel your subscription"}
              </p>
              <div className="modal__input-group">
                <form action="#" method={"post"}>
                  {surveyDetails.options?.map(({ value, id }, index) => (
                    <div key={index} className={"modal__radio"}>
                      <input
                        id={id}
                        name={"survey"}
                        type="radio"
                        value={value}
                      />
                      <label htmlFor={id}>{value}</label>
                    </div>
                  ))}
                </form>
              </div>
            </>
          )}
          {offerType === OFFER_VALUES.COUPON && (
            <>
              <div className={"modal__offer"}>
                <h5 className="modal__offer__title modal__text-title">
                  {offerInView()?.header}
                </h5>
                <h3 className={"modal__offer__value modal__text-title"}>
                  {offerMessage || "10 % discount"}
                </h3>
              </div>
              <button
                type={"submit"}
                className={"modal__btn-primary modal__btn"}
              >
                {/*<img src={pauseIconUrl} alt="" />*/}
                Accept Coupon
              </button>
            </>
          )}
          {/* Step Pause */}
          {offerType === OFFER_VALUES.PAUSE && (
            <>
              <p className={"modal__info"}>{offerMessage}</p>
              <div className="modal__input-group">
                <form action="#" method={"post"}>
                  <label className={"modal__label"}>
                    Pause my subscription for
                  </label>
                  <div className="modal__relative">
                    <select className="modal__select">
                      <option value="1">1 Month</option>
                      <option value="2">2 Month</option>
                    </select>
                    <span className="modal__select-caret">
                      <img src={caretIconUrl} alt="Caret" />
                    </span>
                  </div>
                </form>
                <button className={"modal__btn-primary modal__btn"}>
                  <img src={pauseIconUrl} alt="" />
                  Pause my subscription
                </button>
              </div>
            </>
          )}
          {offerType === OFFER_VALUES.CUSTOM && (
            <>
              <p
                className={"modal__custom_info"}
                dangerouslySetInnerHTML={{ __html: offerInView()?.content }}
              />
              <button className={"modal__btn-primary modal__btn"}>
                <img src={starIconUrl} alt="" />
                Don't cancel
              </button>
            </>
          )}
          {cancel && (
            <>
              <div className={"modal__company"}>
                {accountData?.imageUrl && (
                  <img src={accountData?.imageUrl} alt="" />
                )}
              </div>
              <p className="modal__info">{confirmationDetails.message}</p>
              <button
                type={"submit"}
                className={"modal__btn-primary modal__btn"}
              >
                Don’t cancel
              </button>
            </>
          )}
          {textarea && (
            <>
              <p className={"modal__info"}>
                {textAreaDetails?.description ||
                  "In case you are finally leaving, we hope to see you in the future again. Thanks for your feedback "}
              </p>
              <textarea
                placeholder={"Share your feedback"}
                name="textarea"
                rows="4"
              ></textarea>
              <p className="modal__error-message">Please share your feedback</p>
            </>
          )}
          {confirm && (
            <>
              <div className={"modal__offer modal__mb-20"}>
                <h5 className="modal__offer__title modal__text-title">
                  right now we are applying your
                </h5>
                <h3 className={"modal__offer__value modal__text-title"}>
                  {pause && "Pause"} {coupon && "Coupon"} {cancel && "Cancel"}
                  {!pause && !coupon && !cancel && "Pause"}
                </h3>
                {/*<form action="">*/}
                {/*  <button*/}
                {/*    type={'submit'}*/}
                {/*    className={'modal__btn-primary modal__btn'}*/}
                {/*  >*/}
                {/*    /!*<img src={pauseIconUrl} alt="" />*!/*/}
                {/*    Accept Coupon*/}
                {/*  </button>*/}
                {/*</form>*/}
              </div>
              <p className={"modal__info"}>
                Your decision will take effect in a few minutes
              </p>
            </>
          )}
        </div>
        <hr className={"modal__hr"} />
        <div className={"modal__actions"}>
          {initial && (
            <button className={"modal__btn-primary modal__btn"}>Start</button>
          )}
          {textarea && (
            <>
              <button
                className={
                  "modal__variant-outline modal__text-warning modal__btn"
                }
              >
                Go Back
              </button>
              <button
                className={
                  "modal__variant-outline modal__text-success modal__btn"
                }
              >
                Continue
              </button>
            </>
          )}
          {survey && (
            <button
              className={
                "modal__variant-outline modal__text-success modal__btn"
              }
            >
              Continue
            </button>
          )}
          {cancel && (
            <button className="modal__variant-outline modal__text-error modal__btn">
              Cancel the subscription
            </button>
          )}
          {offerInView() && (
            <>
              <button className="modal__variant-outline modal__text-success modal__btn">
                Go back
              </button>
              <button className="modal__variant-outline modal__text-error modal__btn">
                Not interested
              </button>
            </>
          )}
          {confirm && (
            <button
              className={
                "modal__variant-outline modal__text-success modal__btn"
              }
            >
              Finish
            </button>
          )}
        </div>
        <div className="modal__footer">
          Powered by
          <img src={logoUrl} alt="" />
        </div>
      </div>
      <style jsx>{`
        .modal__btn-primary {
          background-color: ${colors.buttonColor};
          color: ${colors.buttonTextColor};
        }
        .modal__text-success {
          color: ${colors.acceptButtonTextColor};
        }
        .modal__text-error {
          color: ${colors.wrongAnswerButtonTextColor};
        }
        .modal__text-title {
          color: ${colors.mainTitleColor};
        }
        .modal__info {
          color: ${colors.descriptionTextColor};
        }
        .modal__label {
          color: ${colors.subtitleTextColor};
        }
        .modal__radio label {
          color: ${colors.surveyOptionsColor};
          background-color: ${colors.surveyBoxColor};
        }
        .modal__radio input:checked + label {
          background-color: ${colors.buttonColor};
          color: ${colors.buttonTextColor};
          border-color: ${colors.buttonColor};
        }
      `}</style>
    </>
  );
};

Modal.propTypes = {
  colors: PropTypes.object,
  surveyDetails: PropTypes.object,
  blocksInView: PropTypes.object,
  offerRef: PropTypes.any,
};

export default Modal;
