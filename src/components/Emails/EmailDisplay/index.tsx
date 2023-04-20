import React from "react";
import Button from "~/components/Button";
import MoreSVG from "public/images/icons/more.svg";
import Icon from "~/components/Icon";
export default function EmailDisplay({ email, editEmail }) {
  return (
    <div
      className="border-grey-3 border bg-white"
      style={{
        borderRadius: "15px",
      }}
    >
      <div className="mx-6 mt-6 flex justify-center">
        <span
          style={{
            fontSize: "16px",
            lineHeight: "20px",
            fontWeight: "bold",
          }}
        >
          {email.subject}
        </span>
        <span className="ml-auto">
          <Icon IconSource={MoreSVG} DecorationClass={""} />
        </span>
      </div>

      <div className="mx-6 mt-12">
        <h2
          style={{
            fontSize: "16px",
            lineHeight: "20px",
            fontWeight: "bold",
          }}
        >
          Oh no, your payment failed
        </h2>
        <p
          style={{
            fontSize: "12px",
            lineHeight: "20px",
          }}
        >
          Don't worry. We'll try your payment again over the next few days.
        </p>
        <p
          style={{
            fontSize: "12px",
            lineHeight: "20px",
          }}
        >
          To keep &#123; Product premium plan&#125; you may need to update your
          payment details.
        </p>
      </div>
      <div className="mx-6 my-8 flex justify-center">
        <Button onClick={editEmail}>Update Details</Button>
      </div>
      <div
        className="flex content-between bg-gray-200 py-4 px-6"
        style={{
          borderBottomLeftRadius: "15px",
          borderBottomRightRadius: "15px",
          fontSize: "12px",
          color: "#A5A5A5",
          background: "#F7F7F7B2",
        }}
      >
        <div className="w-4/12">
          <p>Delivered</p>
          <p>{email.timesDelivered}</p>
        </div>
        <div className="w-4/12">
          <p>Opens</p>
          <p>{Number(email.openPercentage).toFixed(1)}%</p>
        </div>
        <div className="w-4/12">
          <p>Clicks</p>
          <p>{Number(email.clicksPercentage).toFixed(1)}%</p>
        </div>
        <div className="w-4/12">
          <p>Unsubs</p>
          <p>{Number(email.unsubscribePercentage).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
