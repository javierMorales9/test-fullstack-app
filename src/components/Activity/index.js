import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomInput from "~/components/CustomInput/index2";
import StatusPill from "~/components/StatusPill";
import UserDetails from "~/components/Activity/UserDetails";
import Pagination from "~/components/Pagination";
import Loader from "~/components/Loader";
import { getActivityAPI } from "~/apis/session";
import { MONTHS_SHORT, PRICE_FORMATTER } from "~/utils/constants";
import styles from "./Activity.module.css";

const limit = 10;

const Activity = () => {
  const router = useRouter();
  const { flowId = "" } = router.query;

  const [userData, setUserData] = useState(null);
  const [activities, setActivities] = useState();
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1 });

  const fetchActivity = async () => {
    setLoading(true);
    const response = await getActivityAPI(flowId, {
      startDate,
      endDate,
      page: pagination.currentPage,
      length: limit,
    });
    if (response.isSuccess()) {
      setActivities(response.success());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (flowId) {
      fetchActivity();
    }
  }, [flowId, startDate, endDate, pagination]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    }
    if (name === "endDate") {
      setEndDate(value);
    }
  };

  const handlePreviousPage = () => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: prevState.currentPage - 1,
    }));
  };

  const handleNextPage = () => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: prevState.currentPage + 1,
    }));
  };

  const handlePage = (page) => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Activity</h2>
          <div className={styles.right}>
            {/*<CustomInput*/}
            {/*  variant={'standard'}*/}
            {/*  placeholder={'Search flow'}*/}
            {/*  icon={<img src={SearchIcon.src} alt="" />}*/}
            {/*  className={styles.input}*/}
            {/*/>*/}
            <CustomInput
              type={"date"}
              name={"startDate"}
              value={startDate}
              onChange={handleDateChange}
            />
            <CustomInput
              type={"date"}
              name={"endDate"}
              value={endDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className={styles.listing}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th align={"left"}>Canceller</th>
                <th align={"center"}>Status</th>
                <th align={"center"}>Flow</th>
                <th align={"center"}>Date</th>
                <th align={"center"}>Saved</th>
                <th align={"center"}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities?.sessions?.map(
                (
                  {
                    canceller,
                    status,
                    flowName,
                    flowId: flow,
                    date: d,
                    savedAmount,
                    userData: ud,
                  },
                  i,
                ) => {
                  const date = new Date(d);
                  return (
                    <tr key={i}>
                      <td>
                        <p className={"font-semibold"}>{canceller}</p>
                        {/*<span className={`text-black-3 ${styles.small}`}>*/}
                        {/*  mar***@hot***.com*/}
                        {/*</span>*/}
                      </td>
                      <td>
                        <StatusPill status={status} />
                      </td>
                      <td>
                        <p className={"font-semibold"}>{flowName}</p>
                        <span className={`text-black-3 ${styles.small}`}>
                          {flow}
                        </span>
                      </td>
                      <td>
                        <span className={"font-medium text-black"}>
                          {date.getDate()} {MONTHS_SHORT[date.getMonth()]}{" "}
                          {date.getFullYear()}
                        </span>
                      </td>
                      <td>
                        <span className={"text-success"}>
                          +{PRICE_FORMATTER.format(savedAmount)}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => setUserData(ud)}
                            type={"button"}
                          >
                            See User
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
          {loading && <Loader relative />}
        </div>
      </div>

      <div className={"container pb-10"}>
        <Pagination
          currentPage={pagination.currentPage}
          limit={limit}
          onNext={handleNextPage}
          onPrev={handlePreviousPage}
          onPageClick={handlePage}
          totalCount={activities?.count}
        />
      </div>
      <UserDetails userData={userData} onHide={() => setUserData(null)} />
    </>
  );
};

export default Activity;
