import React from "react";
import PropTypes from "prop-types";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Image from "next/image";
import MenuIcon from "public/images/icons/menu.svg";
import CustomInput from "~/components/CustomInput/index2";
import Button from "~/components/Button";
import CloseIcon from "public/images/icons/close.svg";
import useForm from "~contexts/useFormContext";
import styles from "./Survey.module.css";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const DraggableWrapper = ({ items, move, removeItem }) => {
  const {
    register,
    formState: { errors },
  } = useForm();

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    move(result.source.index, result.destination.index);
  };
  // const handleOption = (e, id) => {
  //   const allItems = [...items];
  //   const index = allItems.findIndex((i) => i.id === id);
  //   if (index > -1) {
  //     allItems[index]['value'] = e.target.value;
  //     setItems(allItems);
  //   }
  // };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mt-2 mb-4 grid grid-cols-1"
          >
            {items.map(({ id }, index) => (
              <Draggable key={id} draggableId={id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={styles.surveyOption}
                  >
                    <input
                      type="hidden"
                      value={id}
                      {...register(`surveyDetails.options.${index}.option_id`, {
                        required: true,
                      })}
                    />
                    <span
                      {...provided.dragHandleProps}
                      className={styles.dragIcon}
                    >
                      <Image
                        // layout={'fill'}
                        // objectFit={'contain'}
                        // objectPosition={'center'}
                        src={MenuIcon}
                      />
                    </span>
                    <div className={"flex-grow"}>
                      <CustomInput
                        className={"bg-white"}
                        weight={"semi-bold"}
                        type={"text"}
                        error={errors?.surveyDetails?.options?.[index]?.value}
                        {...register(`surveyDetails.options.${index}.value`, {
                          required: true,
                        })}
                        // value={value}
                        // onChange={(e) => handleOption(e, id)}
                      />
                    </div>
                    <Button
                      type={"button"}
                      variant={"clean"}
                      size={"small"}
                      className={styles.remove}
                      onClick={() => removeItem(index)}
                    >
                      <Image src={CloseIcon} />
                    </Button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

DraggableWrapper.propTypes = {
  items: PropTypes.array.isRequired,
  move: PropTypes.func.isRequired,
  removeItem: PropTypes.func,
};

export default DraggableWrapper;
