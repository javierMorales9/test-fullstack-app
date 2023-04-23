import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import routes from "~/utils/routes";
import ChartIcon from "public/images/icons/chart.inline.svg";
import { useSortable } from "@dnd-kit/sortable";
import styles from "pages/flows/flows.module.css";

function providerPillClass(provider) {
  return provider ? `${provider}-pill` : "";
}

const FlowCard = ({ flow, index }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: flow.id,
  });

  const {
    id,
    name,
    description,
    activated,
    visualizations: count,
    updatedAt,
    paymentProvider,
    order,
  } = flow;
  console.log(flow);
  const status = activated ? "active" : "paused";
  const date = dayjs(updatedAt).format("MMM DD YYYY");
  return (
    <div
      ref={setNodeRef}
      className={`${styles.flow} ${status} ${
        isDragging ? styles.dragOverlay : ""
      }`}
      {...attributes}
      {...listeners}
      style={{
        transition: [transition].filter(Boolean).join(", "),
        "--translate-x": transform ? `${Math.round(transform.x)}px` : undefined,
        "--translate-y": transform ? `${Math.round(transform.y)}px` : undefined,
        "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
        "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
        "--index": index,
      }}
    >
      <Link href={routes.flow(id)}>
        <div
          className={styles.top}
          style={{
            justifyContent: "unset",
          }}
        >
          <span className={"status-pill"}>
            {status === "active" && "Activated"}
            {status === "paused" && "Paused"}
          </span>
          {paymentProvider ? (
            <span
              className={`status-pill ${providerPillClass(paymentProvider)}`}
              style={{
                marginLeft: ".5rem",
              }}
            >
              {paymentProvider === "local" && "Local"}
              {paymentProvider === "stripe" && "Stripe"}
              {paymentProvider === "braintree" && "Braintree"}
            </span>
          ) : (
            ""
          )}
          <span className="order-number ml-auto">{order}</span>
          {/*<Button*/}
          {/*  className={''}*/}
          {/*  size={'small'}*/}
          {/*  variant={'clean'}*/}
          {/*  icon={moreIcon}*/}
          {/*/>*/}
        </div>
        <div className={styles.details}>
          <h4 className={styles.title}>{name}</h4>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.bottom}>
          <span className={styles.date}>{date}</span>
          <div className={"stats-count"}>
            {count}
            <span className={"icon"}>
              <ChartIcon />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FlowCard;
