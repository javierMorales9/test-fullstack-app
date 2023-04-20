import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import FlowCard from "./FlowCard";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { reorderFlowAPI } from "~/apis/flow";
import styles from "pages/flows/flows.module.css";

const reorderItems = (array, from, to) => {
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0],
  );

  return newArray;
};

const FlowsList = ({ flows, fetchFlows }) => {
  const [newData, setNewData] = useState(flows);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
        // delay: 250,
        // tolerance: 5,
      },
    }),
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (
      newData &&
      newData.map((f) => f.id).join(",") !== flows.map((f) => f.id).join(",")
    ) {
      (async () => {
        await updateFlowOrder(signal);
        await fetchFlows(false);
      })();
    }
    return () => {
      controller.abort();
    };
  }, [newData]);

  const updateFlowOrder = async (signal) => {
    await reorderFlowAPI(
      signal,
      newData.map((f, i) => ({ id: f.id, order: i + 1 })),
    );
  };

  const onDragEnd = (result) => {
    const { active, over } = result;
    if (over) {
      const activeIndex = flows.findIndex((f) => f.id === active.id);
      const overIndex = flows.findIndex((f) => f.id === over.id);
      if (activeIndex !== overIndex) {
        setNewData((items) =>
          reorderItems(items, activeIndex, overIndex).map((f, i) => ({
            ...f,
            order: i + 1,
          })),
        );
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext items={flows}>
        <div className={styles.flowsWrapper}>
          {newData.map((flow, index) => (
            <FlowCard key={flow.id} flow={flow} index={index} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

FlowsList.propTypes = {
  flows: PropTypes.array.isRequired,
};

export default FlowsList;
