import React from "react";
import styles from "pages/users/[userId]/index.module.css";
import InfoIcon from "public/images/icons/info.svg";
import Icon from "../Icon";
import Accordion from "../UI/TransitionAccordion";

function Event() {
  return (
    <div>
      <Accordion>
        <Accordion.Header>
          <div className={styles.notificationCircle}></div>
          <span className={styles.notificationMessage}>
            This is sample Notification
          </span>
          <Icon IconSource={InfoIcon} DecorationClass={"ml-auto"} />
        </Accordion.Header>
        <Accordion.Body>This is nice</Accordion.Body>
      </Accordion>
    </div>
  );
}

export default Event;
