import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import UserIcon from "public/images/dummy/user_2.png";
import CustomInput from "~/components/CustomInput/index2";
import styles from "./UserDetails.module.css";

const UserDetails = ({ userData, onHide }) => {
  const show = !!userData;
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active !== show) {
      setActive(show);
    }
  }, [show]);

  useEffect(() => {
    if (active !== show && active === false) {
      setTimeout(() => {
        onHide();
      }, 150);
    }
  }, [active]);

  const handleBackDropClick = () => {
    setActive(false);
  };

  return (
    show && (
      <>
        <div
          onClick={handleBackDropClick}
          className={`${styles.wrapper} ${active ? styles.active : ""}`}
        />
        <div
          onClick={(e) => e.stopPropagation()}
          className={`${styles.sidebar} ${active ? styles.active : ""}`}
        >
          <div className={styles.top}>
            <img src={UserIcon.src} alt="" />
            <h4 className={styles.name}>Mario Sanz</h4>
            <p className={styles.email}>mar**@hot****.com</p>
          </div>
          <hr />
          <div className={styles.userData}>
            <p className={styles.title}>User Information</p>
            <div>
              <CustomInput
                disabled
                label={"User Id"}
                defaultValue={userData?.userId}
              />
            </div>
            <div>
              <CustomInput
                disabled
                label={"Plan"}
                defaultValue={userData?.plan}
              />
            </div>
            <div>
              <CustomInput
                disabled
                label={"Subscription Price"}
                defaultValue={userData?.subscriptionPrice}
              />
            </div>
            <div>
              <CustomInput
                disabled
                label={"Billing Interval"}
                defaultValue={userData?.billingInterval}
              />
            </div>
            <div>
              <CustomInput
                disabled
                label={"Subscription Age"}
                defaultValue={userData?.subscriptionAge}
              />
            </div>
            <div>
              <CustomInput
                disabled
                label={"Subscription Start Date"}
                defaultValue={new Date(userData?.subscriptionStartDate)
                  .toISOString()
                  .substring(0, 10)}
              />
            </div>
            <div>
              <CustomInput
                disabled
                label={"Subscription Status"}
                defaultValue={userData?.subscriptionStatus}
              />
            </div>
          </div>
          <hr />
        </div>
        <style jsx global>{`
          body {
            overflow: hidden;
            padding-right: 15px;
          }
        `}</style>
      </>
    )
  );
};

UserDetails.propTypes = {
  userData: PropTypes.object,
  onHide: PropTypes.func,
};

export default UserDetails;
