import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "~/HOC/withAuth";
import Button from "~/components/Button";
import TopBar from "~/components/Navigation/TopBar";
import Link from "next/link";
import routes from "~/utils/routes";
import {
  finishPreviewAPI,
  goBackPreviewAPI,
  startSessionPreviewAPI,
  submitAnswerPreviewAPI,
} from "~/apis/session";
import LoaderIcon from "public/images/icons/spinner.inline.svg";
import { OFFER_VALUES } from "~/utils/constants";

const closeIconUrl = "/public/images/icons/close.svg";
const caretIconUrl = "/public/images/icons/caret.inline.svg";
const pauseIconUrl = "/public/images/icons/pause.svg";
const starIconUrl = "/public/images/icons/star.svg";
const logoUrl = "/public/images/logo-grey.png";

const Preview = () => {
  const [colors, setColors] = useState({});
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState({});
  const [showTextAreaError, setShowTextAreaError] = useState(false);
  const router = useRouter();
  const { flowId = "" } = router.query;

  useEffect(() => {
    return () => {
      destroy();
    };
  }, []);

  useEffect(() => {
    setLoading(null);
  }, [data]);

  const startSession = async () => {
    const response = await startSessionPreviewAPI(flowId);
    if (response.isSuccess()) {
      const { token, design, image } = response.success();
      setData({ type: "initial" });
      if (design) {
        setColors(design);
      }
      const sessionData = {};
      if (token) sessionData.token = token;
      if (image) sessionData.image = image;
      setSession(sessionData);
    }
  };

  const renderPage = (response) => {
    const { type } = response || {};
    switch (type) {
      case "survey":
        return renderSurvey(response);
      case "offerpage":
        return renderOffer(response);
      case "textarea":
        return renderTextarea(response);
      case "cancel":
        return renderCancel(response);
      case "final":
        return renderConfirmation(response);
      default:
        destroy();
        return false;
    }
  };

  const finish = async () => {
    if (session) {
      await finishPreviewAPI(session.token);
      setSession(null);
      setLoading(null);
      setData({});
    }
  };

  const destroy = () => {
    finish();
  };

  const goBack = async () => {
    const response = await goBackPreviewAPI(session.token);
    if (response.isSuccess()) {
      renderPage(response.success());
    }
  };

  const submitAnswer = async (payload) => {
    const response = await submitAnswerPreviewAPI(session.token, payload);
    if (response.isSuccess()) {
      renderPage(response.success());
    }
  };

  const renderSurvey = (response) => {
    const { title, hint: description, options, id: page, type } = response;
    setData({ title, description, options, page, type });
  };

  const renderOffer = (response) => {
    const {
      id,
      offerInfo: {
        title,
        message: description,
        header,
        id: offer,
        type,
        maxPauseMonth,
        content,
      } = {},
    } = response;
    switch (type) {
      case OFFER_VALUES.COUPON:
        setData({ title, description, header, page: id, type, offer });
        return;
      case OFFER_VALUES.PAUSE:
        setData({ title, description, page: id, type, offer, maxPauseMonth });
        return;
      case OFFER_VALUES.CUSTOM:
        setData({ title, content, page: id, type, offer });
        return;
      default:
        return;
    }
  };

  const renderTextarea = (response) => {
    const { id: page, description, title, type } = response;
    setData({ title, description, page, type });
  };
  const renderCancel = (response) => {
    const { id: page, message: description, title, type } = response;
    setData({ title, description, page, type });
  };

  const renderConfirmation = (response) => {
    const { id: page, message: description, type } = response;
    setData({
      description,
      page,
      type,
      title: "Thanks for completing the form",
    });
  };

  const CustomButton = ({ loading: isLoading, children, ...props }) => {
    return (
      <button {...props}>
        {isLoading && <LoaderIcon className={"loader"} />}
        {children}
      </button>
    );
  };

  return (
    <>
      <TopBar active={"flows"} />
      <div className={"container  p-4 "}>
        <Link href={routes.flow(flowId)}>
          <a>
            <Button variant={"outline"} type={"button"}>
              Go Back
            </Button>
          </a>
        </Link>
        <div className={"flex justify-center gap-2"}>
          <Button disabled={!!session} onClick={startSession}>
            init
          </Button>
          <Button disabled={!session} onClick={destroy}>
            destroy
          </Button>
        </div>
      </div>
      {session && (
        <>
          <div className="modal">
            <div className="modal__header">
              <h2 className="modal__header__title modal__text-title">
                {data.type === "initial"
                  ? "Welcome to the offboarding flow"
                  : data?.title}
              </h2>
              <button
                disabled={!!loading}
                onClick={destroy}
                className="modal__header__btn-close"
              >
                <span className={"icon icon-close"}>
                  <img src={closeIconUrl} alt="" />
                </span>
              </button>
            </div>
            <div className={"modal__body"}>
              {data?.type === "initial" && (
                <>
                  <div className={"modal__company"}>
                    {session?.image && <img src={session?.image} alt="" />}
                  </div>
                  <p className={"modal__info"}>
                    Before you go, we want to get some information so we can
                    improve our product.
                  </p>
                </>
              )}
              {data?.type === "survey" && (
                <>
                  <p className={"modal__info"}>{data?.description}</p>
                  <div className="modal__input-group">
                    <form action="#" id="surveyForm" method={"post"}>
                      {data?.options?.map((value, index) => (
                        <div key={index} className={"modal__radio"}>
                          <input
                            id={value}
                            name={"survey"}
                            type="radio"
                            value={value}
                          />
                          <label htmlFor={value}>{value}</label>
                        </div>
                      ))}
                    </form>
                  </div>
                </>
              )}
              {data?.type === OFFER_VALUES.COUPON && (
                <>
                  <div className={"modal__offer"}>
                    <h5 className="modal__offer__title modal__text-title">
                      {data?.header}
                    </h5>
                    <h3 className={"modal__offer__value modal__text-title"}>
                      {data?.description}
                    </h3>
                  </div>
                  <CustomButton
                    className={"modal__btn-primary modal__btn"}
                    loading={loading?.continue}
                    disabled={!!loading}
                    onClick={() => {
                      setLoading({ continue: true });
                      submitAnswer({
                        page: data?.page,
                        type: data?.type,
                        answer: true,
                        data: { offer: data?.offer },
                      });
                    }}
                  >
                    {/*<img src={pauseIconUrl} alt="" />*/}
                    Accept Coupon
                  </CustomButton>
                </>
              )}
              {data?.type === OFFER_VALUES.PAUSE && (
                <>
                  <p className={"modal__info"}>{data?.description}</p>
                  <div className="modal__input-group">
                    <form action="#" id={"pauseForm"} method={"post"}>
                      <label className={"modal__label"}>
                        Pause my subscription for
                      </label>
                      <div className="modal__relative">
                        <select name="months" className="modal__select">
                          {Array.from({ length: data?.maxPauseMonth }).map(
                            (o, index) => (
                              <option key={index} value={index + 1}>
                                {index + 1} Month
                              </option>
                            ),
                          )}
                        </select>
                        <span className="modal__select-caret">
                          <img src={caretIconUrl} alt="Caret" />
                        </span>
                      </div>
                    </form>
                    <CustomButton
                      loading={loading?.continue}
                      disabled={!!loading}
                      className={"modal__btn-primary modal__btn"}
                      onClick={() => {
                        const form = document.getElementById("pauseForm");
                        const formData = new FormData(form);
                        const selectedOption = formData.get("months");
                        if (selectedOption) {
                          setLoading({ continue: true });
                          submitAnswer({
                            page: data?.page,
                            type: data?.type,
                            answer: true,
                            data: {
                              offer: data?.offer,
                              monthPaused: parseInt(selectedOption, 10),
                            },
                          });
                        }
                      }}
                    >
                      <img src={pauseIconUrl} alt="" />
                      Pause my subscription
                    </CustomButton>
                  </div>
                </>
              )}
              {data?.type === OFFER_VALUES.CUSTOM && (
                <>
                  <p
                    className={"modal__custom_info"}
                    dangerouslySetInnerHTML={{ __html: data?.content }}
                  />
                  <CustomButton
                    loading={loading?.continue}
                    disabled={!!loading}
                    className={"modal__btn-primary modal__btn"}
                    onClick={() => {
                      setLoading({ continue: true });
                      submitAnswer({
                        page: data?.page,
                        type: data?.type,
                        answer: true,
                        data: { offer: data?.offer },
                      });
                    }}
                  >
                    <img src={starIconUrl} alt="" />
                    Don't cancel
                  </CustomButton>
                </>
              )}
              {data?.type === "textarea" && (
                <>
                  <p className="modal__info">{data?.description}</p>
                  <form action="#" id={"textareaForm"} method={"post"}>
                    <textarea
                      placeholder={"Share your feedback"}
                      name="answer"
                      rows="4"
                    />
                    {showTextAreaError ? (
                      <p className="modal__error-message">
                        Please share your feedback
                      </p>
                    ) : (
                      ""
                    )}
                  </form>
                </>
              )}
              {data?.type === "cancel" && (
                <>
                  <div className={"modal__company"}>
                    {session?.image && <img src={session?.image} alt="" />}
                  </div>
                  <p className="modal__info">{data?.description}</p>
                  <CustomButton
                    className={"modal__btn-primary modal__btn"}
                    loading={loading?.back}
                    disabled={!!loading}
                    onClick={() => {
                      setLoading({ back: true });
                      goBack();
                    }}
                  >
                    Don’t cancel
                  </CustomButton>
                </>
              )}
              {data?.type === "final" && (
                <>
                  <div className={"modal__offer modal__mb-20"}>
                    <h5 className="modal__offer__title modal__text-title">
                      right now we are applying your
                    </h5>
                    <h3 className={"modal__offer__value modal__text-title"}>
                      {data?.description?.charAt(0).toUpperCase() +
                        data?.description?.slice(1)}
                    </h3>
                  </div>
                  <p className={"modal__info"}>
                    Your decision will take effect in a few minutes
                  </p>
                </>
              )}
            </div>
            <hr className={"modal__hr"} />
            <div className={"modal__actions"}>
              {data?.type === "initial" && (
                <CustomButton
                  className={"modal__btn-primary modal__btn"}
                  loading={loading?.start}
                  disabled={!!loading}
                  onClick={() => {
                    setLoading({ start: true });
                    submitAnswer({});
                  }}
                >
                  Start
                </CustomButton>
              )}
              {data?.type === "survey" && (
                <CustomButton
                  className={
                    "modal__variant-outline modal__text-success modal__btn"
                  }
                  loading={loading?.continue}
                  disabled={!!loading}
                  onClick={() => {
                    const form = document.getElementById("surveyForm");
                    const formData = new FormData(form);
                    const selectedOption = formData.get("survey");
                    if (selectedOption) {
                      setLoading({ continue: true });
                      submitAnswer({
                        page: data?.page,
                        type: "survey",
                        answer: selectedOption,
                      });
                    }
                  }}
                >
                  Continue
                </CustomButton>
              )}
              {data?.type === OFFER_VALUES.CUSTOM && (
                <>
                  <CustomButton
                    loading={loading?.back}
                    disabled={!!loading}
                    className="modal__variant-outline modal__text-success modal__btn"
                    onClick={() => {
                      setLoading({ back: true });
                      goBack();
                    }}
                  >
                    Go back
                  </CustomButton>
                  <CustomButton
                    loading={loading?.cancel}
                    disabled={!!loading}
                    className="modal__variant-outline modal__text-error modal__btn"
                    onClick={() => {
                      setLoading({ cancel: true });
                      submitAnswer({
                        page: data?.page,
                        type: data?.type,
                        answer: false,
                      });
                    }}
                  >
                    Cancel anyways
                  </CustomButton>
                </>
              )}
              {(data?.type === OFFER_VALUES.PAUSE ||
                data?.type === OFFER_VALUES.COUPON) && (
                <>
                  <CustomButton
                    loading={loading?.back}
                    disabled={!!loading}
                    className="modal__variant-outline modal__text-success modal__btn"
                    onClick={() => {
                      setLoading({ back: true });
                      goBack();
                    }}
                  >
                    Go back
                  </CustomButton>
                  <CustomButton
                    loading={loading?.cancel}
                    disabled={!!loading}
                    className="modal__variant-outline modal__text-error modal__btn"
                    onClick={() => {
                      setLoading({ cancel: true });
                      submitAnswer({
                        page: data?.page,
                        type: data?.type,
                        answer: false,
                        data: { offer: data?.offer },
                      });
                    }}
                  >
                    Not interested
                  </CustomButton>
                </>
              )}
              {data?.type === "textarea" && (
                <>
                  <CustomButton
                    loading={loading?.back}
                    disabled={!!loading}
                    className="modal__variant-outline modal__text-warning modal__btn"
                    onClick={() => {
                      setLoading({ back: true });
                      goBack();
                    }}
                  >
                    Go back
                  </CustomButton>
                  <CustomButton
                    className="modal__variant-outline modal__text-success modal__btn"
                    loading={loading?.continue}
                    disabled={!!loading}
                    onClick={() => {
                      const form = document.getElementById("textareaForm");
                      const formData = new FormData(form);
                      const answer = formData.get("answer");
                      if (answer) {
                        setShowTextAreaError(false);
                        setLoading({ continue: true });
                        submitAnswer({
                          page: data?.page,
                          type: data?.type,
                          answer,
                        });
                      } else setShowTextAreaError(true);
                    }}
                  >
                    Continue
                  </CustomButton>
                </>
              )}
              {data?.type === "cancel" && (
                <CustomButton
                  className="modal__variant-outline modal__text-error modal__btn"
                  loading={loading?.cancel}
                  disabled={!!loading}
                  onClick={() => {
                    setLoading({ cancel: true });
                    submitAnswer({
                      page: data?.page,
                      type: data?.type,
                      answer: false,
                    });
                  }}
                >
                  Cancel the subscription
                </CustomButton>
              )}
              {data?.type === "final" && (
                <>
                  <CustomButton
                    className={
                      "modal__variant-outline modal__text-success modal__btn"
                    }
                    onClick={destroy}
                  >
                    Finish
                  </CustomButton>
                </>
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
            .modal__error-message {
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
      )}
    </>
  );
};

export default withAuth(Preview);
