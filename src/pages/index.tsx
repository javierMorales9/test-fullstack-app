import React, { useEffect, useState } from "react";
import withAuth from "~/HOC/withAuth";
import Loader from "~/components/Loader";
import TopBar from "~/components/Navigation/TopBar";
import StatsCard from "~/components/Stats/StatsCard";
import CustomInput from "~/components/CustomInput/index2";
import RevenueIcon from "public/images/icons/revenue.inline.svg";
import RatioIcon from "public/images/icons/switch_account.inline.svg";
import UsersIcon from "public/images/icons/receipt.inline.svg";
import CancelIcon from "public/images/icons/undo.inline.svg";
import { wrapper, h2 } from "~/styles/styles.module.css";
import { Doughnut } from "react-chartjs-2";
import { getStatsAPI } from "~/apis/session";
import { getFlowsAPI } from "~/apis/flow";
import Pagination from "~/components/Pagination";
import { PRICE_FORMATTER } from "~/utils/constants";
import styles from "./stats.module.css";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = ["#5542F6", "#FA699D", "#20C9AC", "#00A5FF"];

const limit = 5;

const Stats = () => {
  const [stats, setStats] = useState<{
    boostedRevenue: number;
    savedRatio: number;
    savedUsers: number;
    cancelUsers: number;
    cancellationReasonsStats: [{ _id: string; count: number }];
  }>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingFlows, setLoadingFlows] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1 });
  const [flows, setFlows] = useState<{
    flows: {
      id: string;
      name: string;
      updatedAt: string;
      visualizations: number;
      boostedRevenue: number;
    }[];
    totalCount: number;
  }>({ flows: [], totalCount: 1 });

  const fetchStats = async (payload = {}) => {
    setLoadingStats(true);
    const response = await getStatsAPI(payload);
    if (response.isSuccess()) {
      setStats(response.success());
    }
    setLoadingStats(false);
  };

  useEffect(() => {
    fetchStats({ startDate, endDate });
  }, [startDate, endDate]);

  const fetchFlows = async () => {
    setLoadingFlows(true);
    const response = await getFlowsAPI({
      page: pagination.currentPage.toString(),
      length: limit.toString(),
    });
    if (response.isSuccess()) {
      setFlows(response.success());
    }
    setLoadingFlows(false);
  };
  useEffect(() => {
    fetchFlows();
  }, [pagination]);

  if (loadingStats) {
    return <Loader fullScreen />;
  }

  const handleDateChange = (e: any) => {
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

  const handlePage = (page: number) => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };

  return (
    <>
      <TopBar active={"stats"} />
      <div className={wrapper}>
        <h2 className={`${h2} ${styles.header}`}>
          Stats
          <div className={styles.dateWrapper}>
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
        </h2>
        <div className={styles.cards}>
          <StatsCard
            variant={"primary"}
            change={"positive"}
            icon={RevenueIcon}
            title={"Boosted Revenue"}
            value={PRICE_FORMATTER.format(stats?.boostedRevenue!)}
            info={"21.9%"}
            subInfo={"+1,65K €"}
          />
          <StatsCard
            change={"positive"}
            icon={RatioIcon}
            title={"Saved Ratio"}
            value={`${stats?.savedRatio.toFixed(2)}%`}
            subInfo={"13% this month"}
          />
          <StatsCard
            change={"positive"}
            icon={UsersIcon}
            title={"Saved Users"}
            value={`${stats?.savedUsers}`}
            info={"5.7%"}
            subInfo={"+7 today"}
          />
          <StatsCard
            change={"negative"}
            icon={CancelIcon}
            title={"Cancel Users"}
            value={`${stats?.cancelUsers}`}
            info={"11%"}
            subInfo={"+9 today"}
          />
        </div>
        <div className={styles.charts}>
          <h2 className={`${h2} ${styles.h2}`}>
            Cancellation Reasons
            <span className={styles.iconWrapper}>
              <UsersIcon />
            </span>
          </h2>
          {stats?.cancellationReasonsStats.length ? (
            <div className={styles.chart}>
              <div className={styles.info}>
                <div className={styles.left}>
                  {stats?.cancellationReasonsStats.map(
                    ({ _id: label, count: value }, index) => (
                      <span key={index} className={styles.legend}>
                        <span
                          style={{ backgroundColor: colors[index] }}
                          className={styles.bullet}
                        ></span>
                        {label} ({value}%)
                      </span>
                    ),
                  )}
                </div>
                <div className={styles.right}>
                  <Doughnut
                    options={{
                      cutout: "88%",
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                    data={{
                      labels: stats?.cancellationReasonsStats.map(
                        ({ _id }) => _id,
                      ),
                      datasets: [
                        {
                          data: stats?.cancellationReasonsStats.map(
                            ({ count: value }) => value,
                          ),
                          backgroundColor: colors,
                          hoverOffset: 4,
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <h2>No Data</h2>
          )}
        </div>
        {/*
        <div className={styles.savedCharts}>
          <div className={styles.left}>
            <LineChart />
          </div>
          <div className={styles.right}>
            <span>Movement</span>
            <div className={styles.chartWrapper}>
              <Doughnut
                options={{
                  cutout: '90%',
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        // pointStyleWidth: 10,/
                        boxWidth: 5,
                        boxHeight: 5,
                        padding: 16,
                        font: {
                          size: 14,
                          family: "'Manrope', sans-serif",
                        },
                      },
                    },
                  },
                }}
                data={{
                  labels: ['Total', 'Boosted', 'Lost'],
                  datasets: [
                    {
                      data: [150, 100, 50],
                      backgroundColor: ['#5542F6', '#20C9AC', '#FC3400'],
                      hoverOffset: 8,
                      borderWidth: 0,
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
        */}
        <div className={styles.listingWrapper}>
          <div className={styles.listing}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th align={"left"}>Flow Id</th>
                  <th align={"left"}>Flow Name</th>
                  <th align={"center"}>Last edition</th>
                  <th align={"center"}>Triggers</th>
                  <th align={"center"}>Boosted</th>
                  {/*<th align={'center'}>Cancellations</th>*/}
                </tr>
              </thead>
              <tbody>
                {flows?.flows?.map((flow) => {
                  const {
                    id,
                    name,
                    updatedAt,
                    visualizations,
                    boostedRevenue,
                    // cancellations,
                  } = flow;
                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td className={styles.bold}>{name}</td>
                      <td className={`${styles.bold} ${styles.centered}`}>
                        {new Date(updatedAt).toLocaleDateString()}
                      </td>
                      <td className={styles.centered}>{visualizations}</td>
                      <td className={`${styles.success} ${styles.centered}`}>
                        {PRICE_FORMATTER.format(boostedRevenue)}
                      </td>
                      {/*<td className={styles.centered}>{cancellations}</td>*/}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {loadingFlows && <Loader relative />}
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            limit={limit}
            onNext={handleNextPage}
            onPrev={handlePreviousPage}
            onPageClick={handlePage}
            totalCount={flows?.totalCount}
          />
        </div>
      </div>
    </>
  );
};

export default withAuth(Stats);
