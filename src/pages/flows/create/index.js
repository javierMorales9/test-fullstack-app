import React from "react";
import withAuth from "~/HOC/withAuth";
import CreateFlowComponent from "~/components/FlowCreate";
import { FormProvider } from "~/contexts/useFormContext";

const CreateFlow = () => {
  return (
    <FormProvider>
      <CreateFlowComponent />
    </FormProvider>
  );
};

CreateFlow.propTypes = {};

export default withAuth(CreateFlow);
