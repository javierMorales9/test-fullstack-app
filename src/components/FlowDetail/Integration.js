import React from "react";
import Step from "./Step";
import useUser from "~contexts/userContext";

const IntegrationBlock = () => {
  const { accountData, loading } = useUser();
  if (loading) return <></>;

  const step1Code = `<link rel="stylesheet" href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/css/modal.css">
<script type="text/javascript" src="${process.env.NEXT_PUBLIC_FRONTEND_URL}/js/clickout_final.js"></script>`;
  //<script>
  // !function(){
  //   if (!window.clickout || !window.clickout.created) {
  //     window.clickout = { created: true };
  //     const a = document.createElement('script');
  //     a.src = 'https://code.clickout.com/app.js?id=35je6qetk0531h';
  //     a.async = true;
  //     const b = document.getElementsByTagName('script')[0];
  //     b.parentNode.insertBefore(a, b);
  //   }
  // }();
  // </script>
  const step2Code = `window.addEventListener('load', function() {
  window.clickout.init({
    accountId: '${accountData?.id}',
    apiKey: '${accountData?.apiKey}',
  });
})`;
  const step3Code = `document.getElementById('BUTTON_ID').addEventListener('click', function () {
  const session = window.clickout.startSession({
    userId: 'STRIPE_CUSTOMER_ID',
    wrapper: 'ELEMENT_ID', //optional. Loads popup inside this element if ID is provided.
  });
});`;
  return (
    <>
      <Step
        title={"Step 1 - Copy the style link and script tag"}
        Description={() => (
          <>
            Copy the following css link and paste it inside the{" "}
            <span>{`<head></head>`}</span> tag and the script tag before the
            closing tag of <span>{`</body>`}</span> in your application website.
          </>
        )}
        code={step1Code}
      />
      <Step
        title={`Step 2 - Initialize Clickout`}
        Description={() => (
          <>
            Now initialize the clickout js on window load. Max sure to
            initialize clickout only ONCE.
          </>
        )}
        code={step2Code}
      />
      <Step
        title={`Step 3 - Launch Clickout Session`}
        Description={() => (
          <>
            When your are ready you can add an event to launch the Clickout
            popup when the desired button is clickout. Just change the BUTTON_ID
            and other variables accordingly.
          </>
        )}
        code={step3Code}
      />
    </>
  );
};

export default IntegrationBlock;
