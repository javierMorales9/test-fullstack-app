import React, { Fragment, useState } from "react";
import statusStyles from "../../StatusPill/StatusPill.module.css";
import Icon from "../../Icon";
import GoBack from "public/images/icons/go_back.svg";
import {
  QuestionSchema,
  QuestionType,
  Survey,
  WidgetPosition,
} from "~/utils/types";
import {
  useBoolean,
  useIsClient,
  useIsMounted,
  useUpdateEffect,
} from "usehooks-ts";
import dynamic from "next/dynamic";
import { Dialog, Transition } from "@headlessui/react";
import MultipleChoiceIcon from "public/images/icons/multiple_choice.svg";
import OpenQuestionIcon from "public/images/icons/open_question.svg";
import CTAIcon from "public/images/icons/cta.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import SurveyQuestionForm from "./SurveyQuestionForm";
import CaretUpBold from "public/images/icons/caret-up-bold.svg";
import MenuIcon from "public/images/icons/menu.svg";
import EditSurveyIcon from "public/images/icons/edit-survey.svg";
import DeleteSurveyIcon from "public/images/icons/delete-survey.svg";
import QuestionIcon from "public/images/icons/questions.svg";
import InboxIcon from "public/images/icons/inbox.svg";
import NPSIcon from "public/images/icons/nps.svg";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DesignIcon from "public/images/icons/design-icon.svg";
import ArrowRightSVG from "public/images/icons/play-black.svg";
import CaretIconSVG from "public/images/icons/caret.inline.svg";
import { ChromePicker } from "react-color";
import TargetingIconSVG from "public/images/icons/targeting.svg";
import CustomSelect from "~/components/CustomSelect";
import CustomInput from "~/components/CustomInput";

function getQuestionType(t) {
  switch (t) {
    case QuestionType.NPS:
      return "NPS Question";
    case QuestionType.CTA:
      return "Call to action";
    case QuestionType.OpenText:
      return "Textarea";
    case QuestionType.Select:
      return "Multiple choice";

    default:
      return "";
  }
}

const DevScript = dynamic(() => import("./DevScript"), {
  loading: () => <></>,
  ssr: false,
});

enum CornerStyle {
  Rounded = "rounded",
  Straight = "straight",
}

const cornerStyles = [
  {
    label: "Rounded",
    value: CornerStyle.Rounded,
  },
  {
    label: "Straight",
    value: CornerStyle.Straight,
  },
];

enum DisplayStatus {
  Visible = "visible",
  Hidden = "hidden",
}

const displayStatusList = [
  {
    label: "Visible",
    value: DisplayStatus.Visible,
  },
  {
    label: "Hidden",
    value: DisplayStatus.Hidden,
  },
];

enum BorderHighlight {
  Yes = "yes",
  No = "no",
}

const borderHighLights = [
  {
    label: "Yes",
    value: BorderHighlight.Yes,
  },
  {
    label: "No",
    value: BorderHighlight.No,
  },
];

function QuestionListElement({ index, onEdit, onDelete, hfId }) {
  const question = useWatch({ name: `questions.${index}` });
  const stb = useSortable({ id: hfId });
  const { setNodeRef, attributes, listeners, transition, transform } = stb;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} {...attributes} style={style}>
      <div className="mb-4 flex gap-x-4 px-2">
        <MenuIcon className="w-6 hover:cursor-pointer" {...listeners} />
        <div className="flex-1 rounded border border-gray-200 p-4">
          <p className="font-semibold">
            {question.question || question.headline}
          </p>
          <p className="mt-2 text-sm font-thin text-gray-400">
            {getQuestionType(question.type)}
          </p>
        </div>
        <button onClick={() => onEdit(question, index)}>
          <EditSurveyIcon className="w-7" />
        </button>
        <button onClick={() => onDelete(index)}>
          <DeleteSurveyIcon className="w-7" />
        </button>
      </div>
    </div>
  );
}

enum QuestionRender {
  ShowQuestionList = "question-list",
  ShowQuestionForm = "question-form",
}

function CreateQuestionModal({ isModalOpen, closeModal, createQuestion }) {
  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded bg-white text-left shadow-xl transition-all lg:max-w-4xl xl:max-w-6xl">
                <Dialog.Title
                  as="h2"
                  className="p-8 text-4xl font-medium leading-8"
                >
                  Add Element to Survey
                </Dialog.Title>
                <div
                  className="border-t-2 border-gray-200"
                  style={{ height: "70vh" }}
                >
                  <div className="mt-16 grid grid-cols-3 gap-x-4 gap-y-4 px-8">
                    {/* Multiple Choice Question */}
                    <button
                      onClick={() => {
                        createQuestion(QuestionType.Select);
                        closeModal();
                      }}
                    >
                      <div className="flex gap-x-4 rounded-lg border-2 border-gray-200 px-6 py-4">
                        <MultipleChoiceIcon className="ml-2 w-8 self-center" />
                        <div className="text-left">
                          <p className="text-xl font-semibold">
                            Multiple choice
                          </p>
                          <p className="mt-2 text-xs font-semibold">
                            Say hello and introduce your users to the survey
                          </p>
                        </div>
                      </div>
                    </button>
                    {/* Open Question */}
                    <button
                      onClick={() => {
                        createQuestion(QuestionType.OpenText);
                        closeModal();
                      }}
                    >
                      <div className="flex gap-x-4 rounded-lg border-2 border-gray-200 px-6 py-4">
                        <OpenQuestionIcon className="ml-2 w-8 self-center" />
                        <div className="text-left">
                          <p className="text-xl font-semibold">Open Question</p>
                          <p className="mt-2 text-xs font-semibold">
                            Let your users express themselves in their own words
                          </p>
                        </div>
                      </div>
                    </button>
                    {/* NPS Question */}
                    <button
                      onClick={() => {
                        createQuestion(QuestionType.NPS);
                        closeModal();
                      }}
                    >
                      <div className="flex gap-x-4 rounded-lg border-2 border-gray-200 px-6 py-4">
                        <NPSIcon className="ml-2 w-8 self-center" />
                        <div className="text-left">
                          <p className="text-xl font-semibold">
                            Net Promoter Score (NPS)
                          </p>
                          <p className="mt-2 text-xs font-semibold">
                            Measure brand loyalty with the Net Promoter Score
                          </p>
                        </div>
                      </div>
                    </button>
                    {/* CTA Question */}
                    <button
                      onClick={() => {
                        createQuestion(QuestionType.CTA);
                        closeModal();
                      }}
                    >
                      <div className="flex gap-x-4 rounded-lg border-2 border-gray-200 px-6 py-4">
                        <CTAIcon className="ml-2 w-8 self-center" />
                        <div className="text-left">
                          <p className="text-xl font-semibold">
                            Call To Action
                          </p>
                          <p className="mt-2 text-xs font-semibold">
                            Let users click on a button that leads to a website
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function DnDWrapper({ items, onDragEnd, children, itemKey }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
    useSensor(MouseSensor),
    useSensor(TouchSensor),
  );
  function handleDragEnd(event) {
    const { active, over } = event;
    const activeId = items.indexOf(items.find((q) => q[itemKey] === active.id));
    const overId = items.indexOf(items.find((q) => q[itemKey] === over.id));
    onDragEnd(activeId, overId);
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i[itemKey])}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}

function newQuestion(type: QuestionType) {
  const defaultQuestion = {
    type: type,
    question: "Question",
    explanation: "Explanation",
    slug: "",
  };
  switch (type) {
    case QuestionType.Select:
      return {
        ...defaultQuestion,
        options: [],
      };
    case QuestionType.CTA:
      return {
        ...defaultQuestion,
        linkUrl: "",
        linkText: "",
        headline: "Headline",
        question: undefined,
      };
    case QuestionType.NPS:
      return {
        ...defaultQuestion,
      };
    case QuestionType.OpenText:
      return {
        ...defaultQuestion,
      };
  }
}

function SurveyQuestions({
  hideSurvey,
  showSurvey,
  questionIndex,
  setQuestionIndex,
}) {
  const [questionRender, setQuestionRender] = useState(
    QuestionRender.ShowQuestionList,
  );
  const { control, getValues } = useFormContext();
  const {
    fields: questions,
    remove: deleteQuestion,
    append: addQuestion,
    replace: setQuestions,
  } = useFieldArray({
    control: control,
    name: "questions",
    keyName: "hfId",
  });

  const formQuestion = questions[questionIndex];
  function createQuestion(type: QuestionType) {
    addQuestion(newQuestion(type));
  }

  const {
    value: isCreateModalOpen,
    setTrue: setCreateModalTrue,
    setFalse: setCreateModalFalse,
  } = useBoolean(false);

  function closeModal() {
    setCreateModalFalse();
  }

  function showCreateModal() {
    setCreateModalTrue();
  }

  function saveSurvey(data) {
    console.log(data);
  }
  function handleDragEnd(activeId, overId) {
    const newQuestions = arrayMove(getValues("questions"), activeId, overId);
    setQuestions(newQuestions);
  }

  function editQuestion(question, index) {
    setQuestionIndex(index);
    showQuestionForm();
  }

  function showQuestionList() {
    setQuestionRender(QuestionRender.ShowQuestionList);
    hideSurvey();
  }
  function showQuestionForm() {
    setQuestionRender(QuestionRender.ShowQuestionForm);
    showSurvey();
  }

  return (
    <div className="mx-8 mb-20 border border-gray-200">
      <div className="flex items-center border-b border-gray-200 px-4 py-6">
        <QuestionIcon className="mr-2 w-7" />
        <div className="mr-4">
          <button onClick={() => showQuestionList()}>
            <span className="text-primary text-xl font-bold">Questions</span>
          </button>
          {questionRender === QuestionRender.ShowQuestionForm && (
            <span className="text-xl font-bold text-gray-400">
              /{getQuestionType(formQuestion.type)}
            </span>
          )}
        </div>
        <div className="flex">
          <CaretUpBold className="fill-primary mr-4 w-4 hover:cursor-pointer" />
          <CaretUpBold className="fill-primary w-4 rotate-180 hover:cursor-pointer" />
        </div>
      </div>
      {/* The survey questions list */}
      <div className="px-4 py-6">
        {questionRender === QuestionRender.ShowQuestionList && (
          <>
            <DnDWrapper
              items={questions}
              onDragEnd={handleDragEnd}
              itemKey="hfId"
            >
              {questions.map((question, index) => (
                <QuestionListElement
                  key={question.hfId}
                  hfId={question.hfId}
                  index={index}
                  onDelete={deleteQuestion}
                  onEdit={editQuestion}
                />
              ))}
            </DnDWrapper>
            {!(questions && questions.length) && (
              <div className="mb-8 flex flex-col items-center border-2 border-dashed border-gray-200 py-8">
                <InboxIcon className="w-7" />
                <p className="font-semibold">No questions</p>
                <p className="text-sm text-gray-400">
                  Click below to add the first one
                </p>
              </div>
            )}
            <button
              className="text-primary my-2 w-full rounded py-3 font-semibold"
              style={{ background: "#5542F61A" }}
              onClick={showCreateModal}
            >
              + Add Question
            </button>
          </>
        )}
        {questionRender === QuestionRender.ShowQuestionForm && (
          <SurveyQuestionForm
            index={questionIndex}
            questionType={formQuestion.type}
          />
        )}
      </div>
      <CreateQuestionModal
        createQuestion={createQuestion}
        closeModal={closeModal}
        isModalOpen={isCreateModalOpen}
      />
    </div>
  );
}

function getWidgetPositionCSS(position) {
  switch (position) {
    case WidgetPosition.TopLeft:
      return "top-0 left-0";
    case WidgetPosition.TopRight:
      return "top-0 right-0";
    case WidgetPosition.BottomLeft:
      return "bottom-0 left-0";
    case WidgetPosition.BottomRight:
      return "bottom-0 right-0";
    case WidgetPosition.Mid:
      return "top-1/4 left-1/4";
  }
}

const getHexColor = (color) => {
  if (typeof color === "string") {
    return color;
  }
  let r = color.r.toString(16);
  let g = color.g.toString(16);
  let b = color.b.toString(16);
  let a = Math.round(color.a * 255).toString(16);

  if (r.length === 1) r = "0" + r;
  if (g.length === 1) g = "0" + g;
  if (b.length === 1) b = "0" + b;
  if (a.length === 1) a = "0" + a;

  if (a === "ff") {
    return "#" + r + g + b;
  }

  return "#" + r + g + b + a;
};

function ColorPicker({ field, className, label }) {
  const {
    value: isPickerVisible,
    setTrue: showPicker,
    setFalse: hidePicker,
  } = useBoolean(false);
  const color = useWatch({ name: field });
  const { setValue } = useFormContext();
  function setColor(c) {
    setValue(field, c.hex || getHexColor(c.rgb));
  }

  return (
    <div className={className}>
      <label className="mb-4 text-sm font-semibold">{label}</label>
      <button
        className="h-10 w-full rounded"
        style={{
          backgroundColor: color,
        }}
        onClick={() => showPicker()}
      ></button>
      <div className="relative">
        {isPickerVisible && (
          <div className="absolute top-full z-20">
            <div
              className="fixed bottom-0 left-0 right-0 top-0"
              onClick={() => hidePicker()}
            ></div>
            <ChromePicker onChange={setColor} color={color} />{" "}
          </div>
        )}
      </div>
    </div>
  );
}

function ColorBox({ colorField }) {
  const color = useWatch({ name: colorField });
  return (
    <div
      className="h-8 w-8 rounded border"
      style={{ backgroundColor: color }}
    ></div>
  );
}

function SurveyColorPicker({ className = "" }) {
  const {
    value: colorPickerVisible,
    setTrue: showColorPicker,
    setFalse: hideColorPicker,
  } = useBoolean(false);

  return (
    <div className={className}>
      <div className="flex">
        <div className="flex gap-x-2 rounded border border-gray-200 py-2 pl-4">
          <ColorBox colorField="design.colorTheme.0" />
          <ColorBox colorField="design.colorTheme.1" />
          <button
            onClick={!colorPickerVisible ? showColorPicker : hideColorPicker}
          >
            <ArrowRightSVG
              className={`ml-2 mr-4 w-2 transition-all ${
                colorPickerVisible ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`mt-8 flex gap-x-4 px-4 py-8 ${
          !colorPickerVisible ? "hidden" : ""
        }`}
        style={{
          backgroundColor: "#F1F4FC",
        }}
      >
        <ColorPicker
          label="Accent"
          className="w-1/2"
          field="design.colorTheme.0"
        />
        <ColorPicker
          label="Primary Color"
          className="w-1/2"
          field="design.colorTheme.1"
        />
      </div>
    </div>
  );
}

function WidgetPositionPicker({ className = "" }) {
  const { setValue } = useFormContext();
  const widgetPosition = useWatch({ name: "design.widgetPosition" });
  const positionCSS = getWidgetPositionCSS(widgetPosition);
  function toTopLeft() {
    setValue("design.widgetPosition", WidgetPosition.TopLeft);
  }
  function toTopRight() {
    setValue("design.widgetPosition", WidgetPosition.TopRight);
  }
  function toBottomLeft() {
    setValue("design.widgetPosition", WidgetPosition.BottomLeft);
  }
  function toBottomRight() {
    setValue("design.widgetPosition", WidgetPosition.BottomRight);
  }
  function toCenter() {
    setValue("design.widgetPosition", WidgetPosition.Mid);
  }
  return (
    <div className={className}>
      <label className="text-sm text-gray-600">Widget Position</label>
      <div className="relative mt-4 grid grid-cols-2 border border-gray-200">
        <div
          className={`bg-primary-3 absolute z-10 h-8 w-1/2 ${positionCSS}`}
          style={{
            background: "linear-gradient(0deg, #E7E4FF, #E7E4FF)",
            border: "1px solid #5542F6",
          }}
        ></div>
        <div className="flex h-8 border-b border-r border-gray-200">
          <button onClick={toTopLeft} className="w-1/2"></button>
          <button onClick={toCenter} className="w-1/2"></button>
        </div>
        <div className="flex h-8 border-b border-gray-200">
          <button className="w-1/2" onClick={toCenter}></button>
          <button className="w-1/2" onClick={toTopRight}></button>
        </div>
        <div className="flex h-8 border-r border-gray-200">
          <button onClick={toBottomLeft} className="w-1/2"></button>
          <button onClick={toCenter} className="w-1/2"></button>
        </div>
        <div className="flex h-8">
          <button className="w-1/2" onClick={toCenter}></button>
          <button className="w-1/2" onClick={toBottomRight}></button>
        </div>
      </div>
    </div>
  );
}

function Select({ label, children, className = "" }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-sm font-semibold">
        <label>{label}</label>
        <div className="relative">
          <div
            className="absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2"
            style={{
              backgroundColor: "#00A5FF",
              borderRadius: "50%",
            }}
          ></div>
          <select
            className="w-48 appearance-none rounded border border-gray-200 py-1 pl-7 outline-none"
            style={{
              background: "linear-gradient(0deg, #FBFAFC, #FBFAFC)",
            }}
          >
            {children}
          </select>
          <CaretIconSVG className="absolute right-3 top-1/2 flex w-3 -translate-y-1/2 items-center justify-center" />
        </div>
      </div>
    </div>
  );
}

function SurveyDesignConfiguration({ className = "" }) {
  return (
    <div className={className}>
      <label className="text-sm text-gray-600">Configuration</label>
      <Select className="mt-4" label="Corner Style">
        {cornerStyles.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>

      <Select className="mt-4" label="Highlight Border">
        {borderHighLights.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>

      <Select className="mt-4" label="Progress Bar">
        {displayStatusList.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>

      <Select className="mt-4" label="Close Button">
        {displayStatusList.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>

      <Select className="mt-4" label="Back Navigation">
        {displayStatusList.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>

      <Select className="mt-4" label="Text Direction">
        {displayStatusList.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>

      <Select className="mt-4" label="Refiner Branding">
        {displayStatusList.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

enum DeviceType {
  Mobile = "mobile",
  Desktop = "desktop",
  Tablet = "tablet",
  All = "all",
}

const deviceTypeList = [
  {
    label: "Mobile",
    value: DeviceType.Mobile,
  },
  {
    label: "Desktop",
    value: DeviceType.Desktop,
  },
  {
    label: "Tablet",
    value: DeviceType.Tablet,
  },
  {
    label: "All",
    value: DeviceType.All,
  },
];

function SurveyAudienceConfiguration({ className = "" }) {
  return (
    <div className={className}>
      <label className="text-sm text-gray-600">Target Audience</label>
      <Select className="mt-4" label="User Language">
        {displayStatusList.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>
      <Select className="mt-4" label="Country">
        {displayStatusList.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>
      <Select className="mt-4" label="Device Type">
        {deviceTypeList.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

enum EventTrigger {
  TimeDelay = "time-delay",
  Immediate = "immediate",
}

const eventTriggerList = [
  {
    label: "Time Delay",
    value: EventTrigger.TimeDelay,
  },
  {
    label: "Immediately",
    value: EventTrigger.Immediate,
  },
];

enum Recurrence {
  TimeSequence = "time-sequence",
  Repeating = "repeating",
  OneTime = "one-time",
}

const recurrenceList = [
  {
    label: "Time Sequence",
    value: Recurrence.TimeSequence,
  },
  {
    label: "Repeating",
    value: Recurrence.Repeating,
  },
  {
    label: "One Time",
    value: Recurrence.OneTime,
  },
];

enum PageFilter {
  All = "all",
  Filter = "filter",
  None = "none",
}

const allowFilterList = [
  {
    label: "All",
    value: PageFilter.All,
  },
  {
    label: "Filter",
    value: PageFilter.Filter,
  },
];

const excludeFilterList = [
  {
    label: "None",
    value: PageFilter.None,
  },
  {
    label: "Filter",
    value: PageFilter.Filter,
  },
];

enum SurveyDelayUnit {
  Seconds = "seconds",
  Minutes = "minutes",
  Hours = "hours",
  Days = "days",
  Weeks = "weeeks",
  Years = "years",
}

const surveyDelayList = [
  {
    label: "Seconds",
    value: SurveyDelayUnit.Seconds,
  },
  {
    label: "Minutes",
    value: SurveyDelayUnit.Minutes,
  },
  {
    label: "Hours",
    value: SurveyDelayUnit.Hours,
  },
  {
    label: "Days",
    value: SurveyDelayUnit.Days,
  },
  {
    label: "Weeks",
    value: SurveyDelayUnit.Weeks,
  },
  {
    label: "Years",
    value: SurveyDelayUnit.Years,
  },
];

function SurveyLaunchTriggerConfiguration({ className = "" }) {
  return (
    <div className={className}>
      <label className="text-sm text-gray-600">Launch Triggers</label>
      <Select className="mt-4" label="Trigger Event">
        {eventTriggerList.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>
      <div
        className="mt-4 flex rounded px-4 py-4"
        style={{
          backgroundColor: "#EEEBF0",
        }}
      >
        <div
          style={{
            width: "40%",
          }}
        >
          <label className="text-xs">Launch survey</label>
          <div className="mt-2 flex">
            <select className="rounded-l border-r border-gray-200 px-2 py-2 text-sm">
              {surveyDelayList.slice(0, surveyDelayList.length - 1).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              style={{ width: "40%" }}
              className="py-2 pl-2 text-sm"
            />
          </div>
        </div>
        <div className="ml-auto">
          <label className="text-xs">After the user</label>
          <div className="mt-2">
            <select className="rounded px-2 py-2 text-sm">
              {userEventList.map((o) => (
                <option value={o.value} key={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <Select className="mt-4" label="Recurrence">
        {recurrenceList.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>
      <div
        className="mt-4 flex rounded px-4 py-4"
        style={{
          backgroundColor: "#EEEBF0",
        }}
      >
        <div
          style={{
            width: "40%",
          }}
        >
          <label className="text-xs">Every</label>
          <div className="mt-2 flex">
            <select className="rounded-l border-r border-gray-200 px-1 py-2 text-sm">
              {surveyDelayList.slice(2).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              style={{
                width: "40%",
              }}
              className="py-2 pl-2 text-sm"
            />
          </div>
        </div>
        <div
          className="ml-auto"
          style={{
            width: "30%",
          }}
        >
          <label className="text-xs">Stop After</label>
          <div className="mt-2 flex">
            <select className="rounded-l border-r border-gray-200 px-1 py-2 text-sm">
              {surveyDelayList.slice(2).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              style={{
                width: "40%",
              }}
              type="number"
              className="py-2 pl-2 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SurveyLocationConfiguration({ className = "" }) {
  return (
    <div className={className}>
      <label className="text-sm text-gray-600">Location</label>
      <Select className="mt-4" label="Allowed Pages">
        {allowFilterList.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>
      <div
        className="mt-4 flex rounded px-4 py-4"
        style={{
          backgroundColor: "#EEEBF0",
        }}
      >
        <div>
          <label className="text-xs">Page Filter</label>
          <div className="mt-2 flex">
            <select className="rounded-l border-r border-gray-200 px-1 py-2 text-sm">
              {pageFilterDisplay.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input className="py-2 pl-2 text-sm" />
          </div>
        </div>
      </div>
      <Select className="mt-4" label="Excluded Pages">
        {excludeFilterList.map((opt) => (
          <option value={opt.value} key={opt.value} className="flex">
            {opt.label}
          </option>
        ))}
      </Select>
      <div
        className="mt-4 flex rounded px-4 py-4"
        style={{
          backgroundColor: "#EEEBF0",
        }}
      >
        <div>
          <label className="text-xs">Page Filter</label>
          <div className="mt-2 flex">
            <select className="rounded-l border-r border-gray-200 px-1 py-2 text-sm">
              {pageFilterDisplay.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input className="py-2 pl-2 text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SurveyTargetConfiguration({}) {
  return (
    <div className="mx-8 mb-20 border border-gray-200">
      <div className="flex items-center border-b border-gray-200 px-4 py-6">
        <TargetingIconSVG className="mr-2 w-7" />
        <span className="text-primary text-xl font-bold">Targeting</span>
      </div>
      <div className="px-4 py-6">
        <SurveyAudienceConfiguration />
        <SurveyLaunchTriggerConfiguration className="mt-6" />
        <SurveyLocationConfiguration className="mt-6" />
      </div>
    </div>
  );
}

enum UserEvent {
  FirstSeen = "user-first-seen",
  StartedSession = "user-started-session",
}

const userEventList = [
  {
    label: "User First Seen",
    value: UserEvent.FirstSeen,
  },
  {
    label: "User Started Session",
    value: UserEvent.StartedSession,
  },
];

enum PageFilter {
  Equal = "equal",
  StartsWith = "starts-with",
  Contains = "contains",
  Matches = "matches-a-pattern",
}

const pageFilterDisplay = [
  {
    label: "Equals",
    value: PageFilter.Equal,
  },
  {
    label: "Starts With",
    value: PageFilter.StartsWith,
  },
  {
    label: "Contains",
    value: PageFilter.Contains,
  },
  {
    label: "Matches a Pattern",
    value: PageFilter.Matches,
  },
];

function SurveyDesign({}) {
  return (
    <div className="mx-8 mb-20 border border-gray-200">
      <div className="flex items-center border-b border-gray-200 px-4 py-6">
        <DesignIcon className="mr-2 w-7" />
        <span className="text-primary text-xl font-bold">Design</span>
      </div>
      <div className="px-4 py-6">
        <SurveyColorPicker />
        <WidgetPositionPicker className="mt-6" />
        <SurveyDesignConfiguration className="mt-6" />
      </div>
    </div>
  );
}
export default function SurveyEditor({ survey }: { survey: Survey }) {
  const [selectedButton, setSelectedButton] = useState("questions");

  const {
    value: surveyVisible,
    setTrue: showSurvey,
    setFalse: hideSurvey,
  } = useBoolean(false);

  const [questionIndex, setQuestionIndex] = useState(-1);
  const isClient = useIsClient();
  const isMounted = useIsMounted();
  useUpdateEffect(() => {
    if (isClient && isMounted) {
      // window.survey = survey;
    }
  }, [isMounted, isClient]);

  const form = useForm({
    resolver: zodResolver(QuestionSchema),
    defaultValues: survey,
  });

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  return (
    <div className="flex">
      <FormProvider {...form}>
        <div className="ml-0 flex w-1/2 flex-col bg-white p-0">
          <div className="ml-8 mt-8">
            <span
              className={`${statusStyles.statusPill} ${statusStyles.paused}`}
            >
              {"Inactive"}
            </span>
            <div className="mb-12 mt-4 font-extrabold">
              <p className="text-[28px]">{survey.name}</p>
            </div>
          </div>

          <div className="border-1 border-grey-6 bg-grey-5 w-full border-b border-t py-4 font-bold">
            <button
              className={`ml-8 mr-4 rounded border bg-white p-2 text-sm ${
                selectedButton === "questions" ? "border-blue-1" : ""
              }`}
              onClick={() => handleButtonClick("questions")}
            >
              Questions
            </button>
            <button
              className={`mr-4 rounded border bg-white p-2 text-sm ${
                selectedButton === "design" ? "border-blue-1" : ""
              }`}
              onClick={() => handleButtonClick("design")}
            >
              Design
            </button>
            <button
              className={`mr-4 rounded border bg-white p-2 text-sm ${
                selectedButton === "targeting" ? "border-blue-1" : ""
              }`}
              onClick={() => handleButtonClick("targeting")}
            >
              Targeting
            </button>
          </div>
          <div>
            <div className="mb-8"></div>
            <form
              onSubmit={form.handleSubmit((data) => {
                console.log(data);
              })}
            >
              <SurveyQuestions
                showSurvey={showSurvey}
                hideSurvey={hideSurvey}
                questionIndex={questionIndex}
                setQuestionIndex={setQuestionIndex}
              />
              <SurveyDesign />
              <SurveyTargetConfiguration />
            </form>
          </div>
          <div className="border-1 border-gray-7 relative bottom-0 flex h-[109px] justify-between border">
            <div className="border-grey-8 mb-[33px] ml-[40px] mt-[33px] rounded border bg-white p-[8px] text-[14px]">
              <span className="ml-auto">
                <Icon IconSource={GoBack} DecorationClass={""} />
              </span>
              <button className="font-manrope ml-[8px] bg-white text-[14px]">
                Go Back
              </button>
            </div>

            <div>
              <button className="border-grey-8 font-manrope mb-[33px] mr-[12px] mt-[34px] h-[42px] rounded border bg-white p-[8px] pb-[11px] pl-[16px] pr-[16px] pt-[11px] text-[14px]">
                Save as draft
              </button>
              <button className="bg-purple-1 font-manrope mb-[33px] mr-[40px] mt-[34px] h-[42px] rounded pb-[11px] pl-[16px] pr-[16px] pt-[11px] text-[14px] text-white">
                Save & publish
              </button>
            </div>
          </div>
        </div>
        <div className="h-full w-1/2 px-40 pt-60">
          <div id="clickout_library"></div>
          {isClient && (
            <DevScript
              surveyVisible={surveyVisible}
              currentStep={questionIndex}
            />
          )}
        </div>
      </FormProvider>
    </div>
  );
}
