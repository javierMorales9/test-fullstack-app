import React, { useState } from "react";
import Modal from "~/components/Modal";
import CustomInput from "~/components/CustomInput/index2";
import Button from "~/components/Button";
import Loader from "~/components/Loader";
import { createCampaignAPI } from "~/apis/automation";
import listingStyles from "~/styles/common/listing.module.css";
import classnames from "classnames";

function CreateCampaign({ show, hideModal, onCreate }) {
  const [loading, setLoading] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  async function createCampaign() {
    setLoading(true);
    const res = await createCampaignAPI({ name: campaignName });
    setLoading(false);
    if (res.isSuccess()) {
      const { id } = res.success();
      onCreate(campaignName, id);
      hideModal();
    }
  }
  return (
    <Modal show={show} onHide={hideModal}>
      <Modal.Header>Create Automation</Modal.Header>
      <Modal.Body>
        <CustomInput
          name={"campaignName"}
          label={"Name"}
          value={campaignName}
          onChange={(e) => {
            setCampaignName(e.target.value);
          }}
        />
        <Button
          onClick={createCampaign}
          className={classnames(
            "w-full",
            "mt-8",
            listingStyles.modalFormButton,
          )}
        >
          {loading ? <Loader /> : "Create Campaign"}
        </Button>
      </Modal.Body>
    </Modal>
  );
}
export default CreateCampaign;
