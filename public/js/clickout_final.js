(function (window) {
  // You can disable the strict mode commenting the following line
  "use strict";

  // This function will contain all our code
  function clickoutLibrary() {
    //TODO: Take values from ENV
    const FRONTEND_URL = 'undefined';
    const BASE_URL = 'undefined/session';

    // This variables will be inaccessible to the user, only can be visible in the scope of the library.
    const defaultSettings = {
      API_KEY: null,
      ACCOUNT_ID: null,
    };
    const settings = defaultSettings;

    // This will have modal ID, token and user image for the active session
    const session = { id: null };

    // Client's events
    const eventsAvailable = {};

    function uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16),
      );
    }

    const post = async (url, data = {}) => {
      const response = await fetch(`${BASE_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_key: settings.API_KEY,
          account_id: settings.ACCOUNT_ID,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    };
    const get = async (url) => {
      const response = await fetch(`${BASE_URL}${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          api_key: settings.API_KEY,
          account_id: settings.ACCOUNT_ID,
        },
      });
      return await response.json();
    };

    // APIs
    const startSessionAPI = ({ userId, paymentType }) => {
      return post("/start", { userId, paymentType });
    };

    const submitAnswerAPI = ({ payload }) => {
      return post(`/answer/${session.token}`, payload);
    };

    const goBackAPI = () => {
      return post(`/goBack/${session.token}`);
    };

    // function to fire an event
    function fireEvent(event, data) {
      if (event && typeof event === "function") {
        event(data);
      }
    }

    // function to add client's event
    function addEvent(event, callback) {
      if (
        event &&
        typeof event === "string" &&
        callback &&
        typeof callback === "function"
      ) {
        eventsAvailable[event] = callback;
      }
    }

    const _events = {};
    _events.finish = function (message) {
      fireEvent(eventsAvailable.finish, { type: message.toLowerCase() });
    };
    _events.destroy = function () {
      fireEvent(eventsAvailable.destroy);
    };

    const _modalHelpers = {};

    _modalHelpers.getModal = function () {
      return document.getElementById(session.modalId);
    };

    _modalHelpers.getModalBody = function () {
      const modal = this.getModal();
      return modal.getElementsByClassName("modal__body")[0];
    };

    _modalHelpers.getModalAction = function () {
      const modal = this.getModal();
      return modal.getElementsByClassName("modal__actions")[0];
    };

    _modalHelpers.createHeader = function (
      title = "Welcome to the offboarding flow",
    ) {
      const modal__header = document.createElement("div");
      modal__header.className = "modal__header";

      const modal__header__title = document.createElement("h2");
      modal__header__title.className = "modal__header__title modal__text-title";
      modal__header__title.textContent = title;

      const modal__header__btnClose = document.createElement("button");
      modal__header__btnClose.className = "modal__header__btn-close";
      modal__header__btnClose.innerHTML = `<span class="icon icon-close"><img src="${FRONTEND_URL}/images/icons/close.svg" alt="" /></span>`;
      modal__header__btnClose.onclick = () => destroy(session.modalId);

      modal__header.appendChild(modal__header__title);
      modal__header.appendChild(modal__header__btnClose);
      return modal__header;
    };

    _modalHelpers.updateTitle = function (title) {
      const modal = this.getModal();
      const header = modal.getElementsByClassName("modal__header__title")[0];
      header.textContent = title;
    };

    _modalHelpers.createFooter = function () {
      const modal__footer = document.createElement("div");
      modal__footer.className = "modal__footer";
      modal__footer.innerHTML = `Powered by <img src="${FRONTEND_URL}/images/logo-grey.png" alt="" />`;
      return modal__footer;
    };

    _modalHelpers.createHR = function () {
      const modal__hr = document.createElement("hr");
      modal__hr.className = "modal__hr";
      return modal__hr;
    };

    const _render = {};
    _render.init = function ({ wrapper, modalId }) {
      const modal = document.createElement("div");
      modal.id = modalId;
      modal.className = `modal ${wrapper ? "wrapped" : ""}`;

      const modal__header = _modalHelpers.createHeader(
        "Welcome to the offboarding flow",
      );

      const modal__body = document.createElement("div");
      modal__body.className = "modal__body";
      modal__body.innerHTML =
        '<div class="modal__company">' +
        (session.image ? `<img src="${session.image}" alt="" />` : "") +
        '</div><p class="modal__info">Before you go, we want to get some information so we can improveour product.</p>';

      const modal__hr = _modalHelpers.createHR();

      const modal__actions = document.createElement("div");
      modal__actions.className = `modal__actions`;
      const modal__btn = document.createElement("button");
      modal__btn.className = "modal__btn-primary modal__btn";
      modal__btn.textContent = "Start";
      modal__btn.onclick = async (e) => {
        this.showLoader(e.currentTarget);
        const response = await submitAnswerAPI({});
        renderNext(response);
      };
      modal__actions.appendChild(modal__btn);

      const modal__footer = _modalHelpers.createFooter();

      modal.appendChild(modal__header);
      modal.appendChild(modal__body);
      modal.appendChild(modal__hr);
      modal.appendChild(modal__actions);
      modal.appendChild(modal__footer);

      if (wrapper) {
        const a = document.getElementById(wrapper);
        if (a) {
          a.appendChild(modal);
        } else {
          document.body.appendChild(modal);
        }
      } else {
        document.body.appendChild(modal);
      }
    };

    _render.survey = function ({ title, description, options, page }) {
      const modal__body = document.createElement("div");
      modal__body.className = "modal__body";

      const modal__info = document.createElement("p");
      modal__info.className = "modal__info";
      modal__info.textContent = description;

      const modal__input = document.createElement("div");
      modal__input.className = "modal__input-group";
      const form = document.createElement("form");
      form.action = "#";
      form.method = "POST";

      form.innerHTML = options
        .map((value) => {
          return `<div class="modal__radio"><input id="${value}" name="survey" type="radio" value="${value}" required/><label for="${value}">${value}</label></div>`;
        })
        .join(" ");
      modal__input.appendChild(form);

      modal__body.appendChild(modal__info);
      modal__body.appendChild(modal__input);

      const modal__actions = document.createElement("div");
      modal__actions.className = "modal__actions";
      const modal__btn = document.createElement("button");
      modal__btn.className =
        "modal__variant-outline modal__text-success modal__btn";
      modal__btn.textContent = "Continue";
      modal__btn.onclick = async (e) => {
        this.showLoader(e.currentTarget);
        const formData = new FormData(form);
        const selectedOption = formData.get("survey");
        if (selectedOption) {
          const payload = { page, type: "survey", answer: selectedOption };
          const response = await submitAnswerAPI({ payload });
          renderNext(response);
        } else {
          this.hideLoader(e.currentTarget);
        }
      };
      modal__actions.appendChild(modal__btn);

      _modalHelpers.updateTitle(title);
      _modalHelpers.getModalBody().replaceWith(modal__body);
      _modalHelpers.getModalAction().replaceWith(modal__actions);
    };

    _render.coupon = function ({
      title,
      description,
      header,
      page,
      type,
      offer,
    }) {
      const modal__body = document.createElement("div");
      modal__body.className = "modal__body";

      const modal__offer = document.createElement("div");
      modal__offer.className = "modal__offer";
      const modal__offer__title = document.createElement("h5");
      modal__offer__title.className = "modal__offer__title modal__text-title";
      modal__offer__title.textContent = header;
      const modal__offer__value = document.createElement("h3");
      modal__offer__value.className = "modal__offer__value modal__text-title";
      modal__offer__value.textContent = description;
      modal__offer.appendChild(modal__offer__title);
      modal__offer.appendChild(modal__offer__value);

      const modal__btn = document.createElement("button");
      modal__btn.className = "modal__btn-primary modal__btn";
      modal__btn.textContent = "Accept Coupon";
      modal__btn.onclick = async (e) => {
        this.showLoader(e.currentTarget);
        const payload = { page, type, answer: true, data: { offer } };
        const response = await submitAnswerAPI({ payload });
        renderNext(response);
      };

      modal__body.appendChild(modal__offer);
      modal__body.appendChild(modal__btn);

      const modal__actions = document.createElement("div");
      modal__actions.className = "modal__actions";
      const modal__btn_back = document.createElement("button");
      modal__btn_back.className =
        "modal__variant-outline modal__text-success modal__btn";
      modal__btn_back.textContent = "Go back";
      modal__btn_back.onclick = async (e) => {
        modal__btn.disabled = true;
        modal__btn_not_interested.disabled = true;
        this.showLoader(e.currentTarget);
        const response = await goBackAPI();
        renderNext(response);
      };
      const modal__btn_not_interested = document.createElement("button");
      modal__btn_not_interested.className =
        "modal__variant-outline modal__text-error modal__btn";
      modal__btn_not_interested.textContent = "Not interested";
      modal__btn_not_interested.onclick = async (e) => {
        modal__btn.disabled = true;
        modal__btn_back.disabled = true;
        this.showLoader(e.currentTarget);
        const payload = { page, type, answer: false, data: { offer } };
        const response = await submitAnswerAPI({ payload });
        renderNext(response);
      };
      modal__actions.appendChild(modal__btn_back);
      modal__actions.appendChild(modal__btn_not_interested);

      _modalHelpers.updateTitle(title);
      _modalHelpers.getModalBody().replaceWith(modal__body);
      _modalHelpers.getModalAction().replaceWith(modal__actions);
    };

    _render.pause = function ({
      title,
      description,
      page,
      type,
      offer,
      maxPauseMonth,
    }) {
      const modal__body = document.createElement("div");
      modal__body.className = "modal__body";

      const modal__info = document.createElement("p");
      modal__info.className = "modal__info";
      modal__info.textContent = description;

      const modal__input = document.createElement("div");
      modal__input.className = "modal__input-group";
      const form = document.createElement("form");
      form.action = "#";
      form.method = "POST";
      const modal__label = document.createElement("label");
      modal__label.className = "modal__label";
      modal__label.textContent = "Pause my subscription for";
      const modal__relative = document.createElement("div");
      modal__relative.className = "modal__relative";
      const modal__select = document.createElement("select");
      modal__select.className = "modal__select";
      modal__select.name = "pause_duration";
      for (let i = 1; i <= maxPauseMonth; i++) {
        const option = document.createElement("option");
        option.value = i.toString();
        option.textContent = `${i} Month`;
        modal__select.appendChild(option);
      }
      const modal__select_caret = document.createElement("span");
      modal__select_caret.className = "modal__select-caret";
      modal__select_caret.innerHTML = `<img src="${FRONTEND_URL}/images/icons/caret.inline.svg" alt="Caret" />`;
      modal__relative.appendChild(modal__select);
      modal__relative.appendChild(modal__select_caret);

      form.appendChild(modal__label);
      form.appendChild(modal__relative);

      const modal__btn = document.createElement("button");
      modal__btn.className = "modal__btn-primary modal__btn";
      modal__btn.innerHTML = `<img src="${FRONTEND_URL}/images/icons/pause.svg" alt="" />Pause my subscription`;
      modal__btn.onclick = async (e) => {
        this.showLoader(e.currentTarget);
        modal__btn_back.disabled = true;
        modal__btn_not_interested.disabled = true;
        const formData = new FormData(form);
        const selectedOption = formData.get("pause_duration");
        if (selectedOption) {
          const payload = {
            page,
            type,
            answer: true,
            data: { offer, monthPaused: parseInt(selectedOption, 10) },
          };
          const response = await submitAnswerAPI({ payload });
          renderNext(response);
        } else {
          this.hideLoader(e.currentTarget);
        }
      };

      modal__input.appendChild(form);
      modal__input.appendChild(modal__btn);

      modal__body.appendChild(modal__info);
      modal__body.appendChild(modal__input);

      const modal__actions = document.createElement("div");
      modal__actions.className = "modal__actions";
      const modal__btn_back = document.createElement("button");
      modal__btn_back.className =
        "modal__variant-outline modal__text-success modal__btn";
      modal__btn_back.textContent = "Go back";
      modal__btn_back.onclick = async (e) => {
        modal__btn.disabled = true;
        modal__btn_not_interested.disabled = true;
        this.showLoader(e.currentTarget);
        const response = await goBackAPI();
        renderNext(response);
      };
      const modal__btn_not_interested = document.createElement("button");
      modal__btn_not_interested.className =
        "modal__variant-outline modal__text-error modal__btn";
      modal__btn_not_interested.textContent = "Not interested";
      modal__btn_not_interested.onclick = async (e) => {
        modal__btn.disabled = true;
        modal__btn_back.disabled = true;
        this.showLoader(e.currentTarget);
        const payload = {
          page,
          type,
          answer: false,
          data: { offer },
        };
        const response = await submitAnswerAPI({ payload });
        renderNext(response);
      };
      modal__actions.appendChild(modal__btn_back);
      modal__actions.appendChild(modal__btn_not_interested);

      _modalHelpers.updateTitle(title);
      _modalHelpers.getModalBody().replaceWith(modal__body);
      _modalHelpers.getModalAction().replaceWith(modal__actions);
    };

    _render.customContent = function ({ title, content, page, type, offer }) {
      const modal__body = document.createElement("div");
      modal__body.className = "modal__body";

      const modal__info = document.createElement("p");
      modal__info.className = "modal__custom_info";
      modal__info.innerHTML = content;

      const modal__btn = document.createElement("button");
      modal__btn.className = "modal__btn-primary modal__btn";
      modal__btn.innerHTML = `<img src="${FRONTEND_URL}/images/icons/star.svg" alt="" /> Don't Cancel`;
      modal__btn.onclick = async (e) => {
        modal__btn_back.disabled = true;
        modal__btn_cancel.disabled = true;
        this.showLoader(e.currentTarget);
        const payload = {
          page,
          type,
          answer: true,
          data: {
            offer,
          },
        };
        const response = await submitAnswerAPI({ payload });
        renderNext(response);
      };

      modal__body.appendChild(modal__info);
      modal__body.appendChild(modal__btn);

      const modal__actions = document.createElement("div");
      modal__actions.className = "modal__actions";

      const modal__btn_back = document.createElement("button");
      modal__btn_back.className =
        "modal__variant-outline modal__text-warning modal__btn";
      modal__btn_back.textContent = "Go back";
      modal__btn_back.onclick = async (e) => {
        modal__btn.disabled = true;
        modal__btn_cancel.disabled = true;
        this.showLoader(e.currentTarget);
        const response = await goBackAPI();
        renderNext(response);
      };

      const modal__btn_cancel = document.createElement("button");
      modal__btn_cancel.className =
        "modal__variant-outline modal__text-error modal__btn";
      modal__btn_cancel.textContent = "Cancel anyways";
      modal__btn_cancel.onclick = async (e) => {
        modal__btn.disabled = true;
        modal__btn_back.disabled = true;
        this.showLoader(e.currentTarget);
        const payload = { page, type, answer: false };
        const response = await submitAnswerAPI({ payload });
        renderNext(response);
      };

      modal__actions.appendChild(modal__btn_back);
      modal__actions.appendChild(modal__btn_cancel);

      _modalHelpers.updateTitle(title);
      _modalHelpers.getModalBody().replaceWith(modal__body);
      _modalHelpers.getModalAction().replaceWith(modal__actions);
    };

    _render.textarea = function ({ id, description, title, type }) {
      let showErrorMessage = false;

      const modal__body = document.createElement("div");
      modal__body.className = "modal__body";

      const modal__info = document.createElement("p");
      modal__info.className = "modal__info";
      modal__info.textContent = description;

      const form = document.createElement("form");
      form.action = "#";
      form.method = "POST";
      const textarea = document.createElement("textarea");
      textarea.rows = 4;
      textarea.placeholder = "Share your feedback";
      textarea.name = "answer";
      form.appendChild(textarea);
      const errormessage = document.createElement("p");
      errormessage.className = "modal__error-message";
      errormessage.style.display = "none";
      errormessage.textContent = "Please share your feedback";
      form.appendChild(errormessage);

      function setShowErrorMessage(value) {
        showErrorMessage = value;
        if (showErrorMessage) errormessage.style.display = "inline-block";
        else errormessage.style.display = "none";
      }

      modal__body.appendChild(modal__info);
      modal__body.appendChild(form);

      const modal__actions = document.createElement("div");
      modal__actions.className = "modal__actions";

      const modal__btn_back = document.createElement("button");
      modal__btn_back.className =
        "modal__variant-outline modal__text-warning modal__btn";
      modal__btn_back.textContent = "Go back";
      modal__btn_back.onclick = async (e) => {
        modal__btn.disabled = true;
        this.showLoader(e.currentTarget);
        const response = await goBackAPI();
        renderNext(response);
      };

      const modal__btn = document.createElement("button");
      modal__btn.className =
        "modal__variant-outline modal__text-success modal__btn";
      modal__btn.textContent = "Continue";
      modal__btn.onclick = async (e) => {
        modal__btn_back.disabled = true;
        this.showLoader(e.currentTarget);
        const formData = new FormData(form);
        const answer = formData.get("answer");
        if (answer) {
          setShowErrorMessage(false);
          const payload = { page: id, type: "textarea", answer };
          const response = await submitAnswerAPI({ payload });
          renderNext(response);
        } else {
          setShowErrorMessage(true);
          this.hideLoader(e.currentTarget);
        }
      };

      modal__actions.appendChild(modal__btn_back);
      modal__actions.appendChild(modal__btn);

      _modalHelpers.updateTitle(title);
      _modalHelpers.getModalBody().replaceWith(modal__body);
      _modalHelpers.getModalAction().replaceWith(modal__actions);
    };

    _render.cancel = function ({ id, message, title, type }) {
      const modal__body = document.createElement("div");
      modal__body.className = "modal__body";

      const modal__company = document.createElement("div");
      modal__company.className = "modal__company";
      if (session.image) {
        modal__company.innerHTML = `<img src="${session.image}" alt="" />`;
      }
      const modal__info = document.createElement("p");
      modal__info.className = "modal__info";
      modal__info.textContent = message;

      const modal__btn_back = document.createElement("button");
      modal__btn_back.className = "modal__btn-primary modal__btn";
      modal__btn_back.textContent = "Don’t cancel";
      modal__btn_back.onclick = async (e) => {
        this.showLoader(e.currentTarget);
        modal__btn_cancel.disabled = true;
        const response = await goBackAPI();
        renderNext(response);
      };

      modal__body.appendChild(modal__company);
      modal__body.appendChild(modal__info);
      modal__body.appendChild(modal__btn_back);

      const modal__actions = document.createElement("div");
      modal__actions.className = "modal__actions";
      const modal__btn_cancel = document.createElement("button");
      modal__btn_cancel.className =
        "modal__variant-outline modal__text-error modal__btn";
      modal__btn_cancel.textContent = "Cancel the subscription";
      modal__btn_cancel.onclick = async (e) => {
        this.showLoader(e.currentTarget);
        modal__btn_back.disabled = true;
        const payload = { page: id, type, answer: false };
        const response = await submitAnswerAPI({ payload });
        renderNext(response);
      };
      modal__actions.appendChild(modal__btn_cancel);

      _modalHelpers.updateTitle(title);
      _modalHelpers.getModalBody().replaceWith(modal__body);
      _modalHelpers.getModalAction().replaceWith(modal__actions);
    };

    _render.final = function ({ id, message, type }) {
      _events.finish(message);
      const modal__body = document.createElement("div");
      modal__body.className = "modal__body";

      const modal__offer = document.createElement("div");
      modal__offer.className = "modal__offer modal__mb-20";
      const modal__offer__title = document.createElement("h5");
      modal__offer__title.className = "modal__offer__title modal__text-title";
      modal__offer__title.textContent = "right now we are applying your";
      const modal__offer__value = document.createElement("h3");
      modal__offer__value.className = "modal__offer__value modal__text-title";
      modal__offer__value.textContent =
        message.charAt(0).toUpperCase() + message.slice(1);
      modal__offer.appendChild(modal__offer__title);
      modal__offer.appendChild(modal__offer__value);

      const modal__info = document.createElement("p");
      modal__info.className = "modal__info";
      modal__info.textContent =
        "Your decision will take effect in a few minutes";

      modal__body.appendChild(modal__offer);
      modal__body.appendChild(modal__info);

      const modal__actions = document.createElement("div");
      modal__actions.className = "modal__actions";
      const modal__btn_finish = document.createElement("button");
      modal__btn_finish.className =
        "modal__variant-outline modal__text-success modal__btn";
      modal__btn_finish.textContent = "Finish";
      modal__btn_finish.onclick = async (e) => {
        this.showLoader(e.currentTarget);
        destroy(session.modalId);
      };
      modal__actions.appendChild(modal__btn_finish);

      _modalHelpers.updateTitle("Thanks for completing the form");
      _modalHelpers.getModalBody().replaceWith(modal__body);
      _modalHelpers.getModalAction().replaceWith(modal__actions);
    };

    _render.showLoader = function (button) {
      button.disabled = true;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttributeNS(null, "fill", "none");
      svg.setAttributeNS(null, "viewBox", "0 0 24 24");
      svg.classList.add("loader");
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttributeNS(null, "opacity", 0.25);
      circle.setAttributeNS(null, "cx", 12);
      circle.setAttributeNS(null, "cy", 12);
      circle.setAttributeNS(null, "r", 10);
      circle.setAttributeNS(null, "stroke", "currentColor");
      circle.setAttributeNS(null, "stroke-width", 4);
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttributeNS(null, "opacity", 0.75);
      path.setAttributeNS(null, "fill", "currentColor");
      path.setAttributeNS(
        null,
        "d",
        "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
      );
      svg.appendChild(circle);
      svg.appendChild(path);
      button.prepend(svg);
    };
    _render.hideLoader = function (button) {
      button.disabled = false;
      const loader = button.getElementsByClassName("loader")[0];
      loader.remove();
    };

    var _clickoutLibraryObject = {};

    // Destroy the initialized session
    const destroy = function (element, hard = false) {
      document.getElementById(element)?.remove();
      const els = document.getElementsByClassName(element);
      Array.prototype.forEach.call(els, function (el) {
        el.remove();
      });
      if (hard) {
        settings.ACCOUNT_ID = null;
        settings.API_KEY = null;
      }
      session.modalId = null;
      session.token = null;
      session.image = null;
      _events.destroy();
    };

    // Initialize the library
    _clickoutLibraryObject.init = function ({ accountId, apiKey }) {
      if (settings.ACCOUNT_ID || settings.API_KEY) {
        throw new Error("Session Already Initialized");
      }
      if (!accountId) {
        throw new Error("Account ID is missing");
      }
      if (!apiKey) {
        throw new Error("API key is missing");
      }

      settings.ACCOUNT_ID = accountId;
      settings.API_KEY = apiKey;
    };

    // start the session
    _clickoutLibraryObject.startSession = function ({
      userId,
      paymentType,
      wrapper,
    }) {
      if (session.modalId) {
        throw new Error("Sessions already in progress");
      }
      if (!userId) {
        throw new Error("User ID is missing");
      }
      const modalId = uuidv4();
      session.modalId = modalId;

      (async function () {
        const { token, design, image } = await startSessionAPI({
          userId,
          paymentType,
        });
        session.token = token;
        session.image = image;
        const {
          buttonColor,
          buttonTextColor,
          acceptButtonTextColor,
          wrongAnswerButtonTextColor,
          mainTitleColor,
          descriptionTextColor,
          subtitleTextColor,
          surveyOptionsColor,
          surveyBoxColor,
        } = design;
        const css =
          `.modal__btn-primary {background-color: ${buttonColor};color: ${buttonTextColor};}` +
          `.modal__text-success {color: ${acceptButtonTextColor};}` +
          `.modal__text-error {color: ${wrongAnswerButtonTextColor};}` +
          `.modal__text-title {color: ${mainTitleColor};}` +
          `.modal__info {color: ${descriptionTextColor};}` +
          `.modal__label {color: ${subtitleTextColor};}` +
          `.modal__radio label {color: ${surveyOptionsColor};background-color: ${surveyBoxColor};}` +
          `.modal__radio input:checked + label {background-color: ${buttonColor};color: ${buttonTextColor};border-color: ${buttonColor};}`;
        const head = document.head || document.getElementsByTagName("head")[0];
        const style = document.createElement("style");
        style.className = modalId;

        head.appendChild(style);

        style.appendChild(document.createTextNode(css));

        _render.init({ wrapper, modalId });
      })();

      return {
        destroy: () => destroy(modalId, true),
        endSession: () => {
          destroy(modalId);
        },
      };
    };

    const renderNext = function (data) {
      switch (data.type) {
        case "survey": {
          const { title, hint: description, options, id: page } = data;
          _render.survey({ title, description, options, page });
          break;
        }
        case "offerpage": {
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
          } = data;
          if (type === "coupon") {
            _render.coupon({
              title,
              description,
              header,
              page: id,
              type,
              offer,
              maxPauseMonth,
            });
          }

          if (type === "pause") {
            _render.pause({
              title,
              description,
              header,
              page: id,
              type,
              offer,
              maxPauseMonth,
            });
          }

          if (type === "customcontent") {
            _render.customContent({
              title,
              page: id,
              offer,
              type,
              content,
            });
          }
          break;
        }
        case "textarea":
          _render.textarea(data);
          break;
        case "cancel":
          _render.cancel(data);
          break;
        case "final":
          _render.final(data);
          break;

        default:
          break;
      }
    };

    _clickoutLibraryObject.on = function (event, callback) {
      addEvent(event, callback);
    };

    return _clickoutLibraryObject;
  }

  // We need that our library is globally accessible, then we save in the window
  if (typeof window.clickout === "undefined") {
    window.clickout = clickoutLibrary();
  }
})(window); // We send the window variable withing our function
