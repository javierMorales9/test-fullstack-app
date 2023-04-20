import React from "react";
import Link from "next/link";
import Collapse from "~/components/Collapse";
import Card from "~/components/Settings/Card";
import {
  title as titleCss,
  description as descriptionCss,
} from "~/components/Settings/settings.module.css";
import routes from "~/utils/routes";
import styles from "./HelpBlock.module.css";

const faqs = [
  {
    id: 1,
    title: "What payment providers do you support?",
    description: `Currently, we support Stripe, Braintree and will be rolling out support for Recurly, Chargebee, and others in the future. If you're using one of those, let us know. We can work with you to prioritize an integration.`,
  },
  {
    id: 2,
    title: "Can I cancel at any time?",
    description: `Correct. We don't lock you into a contract. You're in full control if you don't believe you're getting your money's worth.`,
  },
  {
    id: 3,
    title: "Can you help me set it up?",
    description: `Absolutely. We're quick to answer questions, and we'll even set up a call to walk you through the install. Many of our customers like us to be "on call" while they implement, even though a number of our customers have implemented Clickout within 15-25 minutes.`,
  },
  {
    id: 4,
    title: "What does it take to implement?",
    description: () => (
      <>
        You can set Clickout up in as little as 15 minutes (we've seen it
        happen). If you get fancier with segmentation or test environments, that
        adds a bit of overhead.{" "}
        <Link href={routes.settingsScript}>
          <a className={"link"}> Check out our documentation.</a>
        </Link>
      </>
    ),
  },
  {
    id: 5,
    title: "What determines if a user is saved?",
    description: `By default, if your user loads the page and does not come back to cancel after 30 days, Brightback will count them as a save. This time period is adjustable in your account settings.`,
  },
];

const HelpBlock = () => {
  return (
    <>
      {faqs.map(({ id, title, description: Description }) => (
        <Card key={id} mb4>
          <Collapse title={title}>
            <p className={`${styles.description} ${descriptionCss}`}>
              {typeof Description === "string" ? Description : <Description />}
            </p>
          </Collapse>
        </Card>
      ))}
      <div className={"mt-7 text-center"}>
        <p className={titleCss}>Any other question?</p>
        <p className={"label mt-3"}>
          You can{" "}
          <a className={"link"} href="#">
            contact us
          </a>{" "}
          anytime and we will attend you in less than 24 hours
        </p>
      </div>
    </>
  );
};

export default HelpBlock;
