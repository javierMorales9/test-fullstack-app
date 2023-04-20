import React from "react";
import Card from "~/components/Settings/Card";
import BgImage from "public/images/plan-bg.inline.svg";
import FileIcon from "public/images/icons/file.svg";
import Image from "next/image";
import styles from "./MyPlanBlock.module.css";

const invoices = [
  { date: "December 31 2022", number: "#5435", price: "29,90€" },
  { date: "November 30 2022", number: "#5435", price: "29,90€" },
  { date: "October 25 2022", number: "#5435", price: "29,90€" },
  { date: "September 24 2022", number: "#5435", price: "29,90€" },
  { date: "August 30 2022", number: "#5435", price: "29,90€" },
  { date: "July 24 2022", number: "#5435", price: "29,90€" },
  { date: "June 14 2022", number: "#7658", price: "29,90€" },
  { date: "May 4 2022", number: "#4357", price: "29,90€" },
];

const MyPlanBlock = () => {
  return (
    <>
      <Card p0 pb0>
        <div className={styles.topWrapper}>
          <div className={styles.top}>
            <div className={styles.bg}>
              <BgImage />
            </div>
            <div className={styles.price}>29,90 €</div>
            <div>
              <p className={styles.title}>
                This is what you are currently paying
              </p>
              <p className={styles.info}>
                Payments are processed on the 4th of each month.
              </p>
            </div>
          </div>
        </div>
        <div className={styles.invoices}>
          <p className={styles.title}>See my invoices</p>
          <p className={styles.info}>
            Here you can see and download the invoices
          </p>
        </div>
        {invoices.map(({ date, number, price }) => (
          <div className={styles.invoice}>
            <div className={styles.invoiceDetails}>
              <div className={styles.iconWrapper}>
                <Image
                  src={FileIcon}
                  width={24}
                  height={24}
                  objectPosition={"center"}
                />
              </div>
              {date}
              <span>{number}</span>
            </div>
            <div className={styles.plan}>
              <span className={styles.button}>Basic Plan</span>
              {price}
            </div>
            <button className={styles.button}>Download</button>
          </div>
        ))}
      </Card>
    </>
  );
};

export default MyPlanBlock;
