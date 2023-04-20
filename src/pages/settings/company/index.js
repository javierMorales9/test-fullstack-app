import React, { useEffect, useState } from "react";
import router from "next/router";
import TopBar from "~/components/Navigation/TopBar";
import Sidebar from "~/components/Settings/Sidebar";
import { wrapper } from "~/styles/styles.module.css";
import { getInfoAPI, addInfoAPI, uploadLogoAPI } from "~/apis/account";
import CompanyBlock from "~/components/Settings/ConfigurationBlock/CompanyBlock";
import useUser from "~/contexts/userContext";
import routes from "~/utils/routes";
import styles from "../settings.module.css";

const Company = () => {
  const { setAccountData } = useUser();
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState({});
  const [accountImage, setAccountImage] = useState("");

  const fetchAccountInfo = async () => {
    setLoading(true);
    const response = await getInfoAPI();
    if (response.success()) {
      setCompanyData(response.success()?.companyData || {});
      setAccountImage(response.success()?.imageUrl);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  const handleAccountInfo = async (data) => {
    setLoading(true);
    const formData = new FormData();
    if (data.accountImage && data.accountImage[0]) {
      formData.append(
        "accountImage",
        data.accountImage[0] || "",
        data.accountImage[0]?.name || "",
      );
    }
    delete data.accountImage;

    const promises = [addInfoAPI({ companyData: data })];
    if (formData.get("accountImage")) {
      promises.push(uploadLogoAPI(formData));
    }
    const responses = await Promise.all(promises);
    if (responses[0].isSuccess()) {
      setCompanyData(responses[0].success()?.companyData || {});
      setAccountData(responses[0].success() || {});
      router.push(routes.settings);
    }
    if (responses[1] && responses[1].isSuccess()) {
      setAccountData((prevState) => ({
        ...prevState,
        imageUrl: responses[1].success()?.imageUrl,
      }));
    }
    setLoading(false);
  };

  return (
    <>
      <TopBar active={"settings"} />
      <div className={`${styles.wrapper} ${wrapper}`}>
        <div className={styles.left}>
          <Sidebar active={"configuration"} />
        </div>
        <div className={styles.right}>
          <CompanyBlock
            defaultValues={companyData}
            handleAccountInfo={handleAccountInfo}
            accountImage={accountImage}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default Company;
