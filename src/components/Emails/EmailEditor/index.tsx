import React, { useEffect, useRef, useState } from "react";
import EmailEditor from "react-email-editor";
import { Dialog, Transition } from "@headlessui/react";
import Button from "~/components/Button";
import CaretIcon from "public/images/icons/caret.inline.svg";
import { EmailSchema } from "../forms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEMailAPI, updateEMailAPI } from "~/apis/emails";
import Icon from "~/components/Icon";
import TagFilledIcon from "public/images/icons/tag_filled.svg";
import SettingsHelpIcon from "public/images/icons/settigs-help.inline.svg";
import InfoIcon from "public/images/icons/info-yellow.svg";
import MessageArrowIcon from "public/images/icons/message-arrow.svg";
import MagicIcon from "public/images/icons/magic.svg";
import styles from "./index.module.css";

// eslint-disable-next-line react/display-name
export default function ({ isOpen, onClose, email, onCreateUpdate }) {
  const emailEditorRef = useRef(null);
  const submitRef = useRef(null);
  console.log(email);
  const { register, setValue, handleSubmit, formState } = useForm({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      subject: email ? email.subject : "",
      content: email ? email.content : "",
      design: email ? email.design : "",
    },
  });
  useEffect(() => {
    if (email) {
      setValue("subject", email.subject);
      setValue("content", email.content);
    }
  }, [email]);
  console.log(formState.errors);
  function exportHTML() {
    console.log("Exporting to html");
    emailEditorRef.current.editor.exportHtml((data) => {
      const { html, design } = data;
      setValue("content", html);
      setValue("design", JSON.stringify(design));
    });
  }

  function onLoad() {
    console.log("Loaded");
    if (email) {
      emailEditorRef.current.editor.loadDesign(JSON.parse(email.design));
    }
  }

  function onReady() {
    console.log("Ready");
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel
            className={
              "w-full transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all " +
              styles.emailEditorModal
            }
          >
            <form
              onSubmit={handleSubmit((data) => {
                emailEditorRef.current.editor.exportHtml(({ html, design }) => {
                  if (email)
                    updateEMailAPI(email.id, {
                      subject: data.subject,
                      content: html,
                      design: JSON.stringify(design),
                    }).then((res) => {
                      if (res.isSuccess()) {
                        onCreateUpdate();
                      } else console.log(res.fail());
                    });
                  else
                    createEMailAPI({
                      subject: data.subject,
                      content: html,
                      design: JSON.stringify(design),
                    }).then((res) => {
                      if (res.isSuccess()) {
                        onCreateUpdate();
                      } else {
                        console.log(res.fail());
                      }
                    });
                });
              })}
            >
              <div className="flex items-center border-b-2 border-gray-200 py-1 px-6">
                <span className="text-lg">Make Checklist Work for you</span>
                <Icon
                  IconSource={InfoIcon}
                  DecorationClass={"ml-auto mr-2 mt-1"}
                />
                <span className="text-sm text-gray-400">Cancel</span>
                <Button
                  variant="outline"
                  className="ml-4"
                  type="button"
                  onClick={() => {
                    exportHTML();
                    submitRef.current.click();
                  }}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  className="ml-4"
                  onClick={() => {
                    exportHTML();
                    submitRef.current.click();
                    onClose();
                  }}
                >
                  Save and Close
                </Button>
              </div>
              <div className="flex border-b-2 border-gray-200 px-6">
                <span className="flex w-4/12 items-center border-r-2 border-gray-200">
                  <label className="mr-4 text-sm text-gray-400">
                    Category:
                  </label>
                  <Icon
                    IconSource={SettingsHelpIcon}
                    DecorationClass="h-7 w-7 mt-2 mr-2"
                  />
                  <select className="mr-2 w-full p-1">
                    <option value="marketing-email">Marketing Email</option>
                  </select>
                  <span>
                    <CaretIcon />
                  </span>
                </span>
                <Button
                  className="my-1 ml-auto"
                  variant="outline"
                  type="button"
                >
                  <Icon IconSource={MagicIcon} DecorationClass="h-5 w-5" />
                  Magic Writer
                </Button>
                <Button className="my-1 ml-4" variant="outline" type="button">
                  <Icon
                    IconSource={MessageArrowIcon}
                    DecorationClass="h-4 w-4 -rotate-45"
                  />
                  Send Test
                </Button>
              </div>
              <div className="flex border-b-2 border-gray-200 px-6">
                <span className="flex w-4/12 items-center border-r-2 border-gray-200 py-1">
                  <label className="text-sm text-gray-400 lg:w-1/4 xl:w-2/12">
                    Subject:{" "}
                  </label>
                  <input
                    {...register("subject")}
                    className="my-1 mx-2 flex-grow p-1"
                  />
                  <Icon
                    IconSource={TagFilledIcon}
                    DecorationClass="mr-2 mt-2"
                  />
                </span>
                <span className="flex w-4/12 items-center border-r-2 border-gray-200">
                  <label className="ml-2 w-1/4 text-sm text-gray-400">
                    From Email:
                  </label>
                  <input
                    value="beltran@clickout.io"
                    className="my-1 mx-2 w-3/4 p-1"
                  />
                </span>
                <span className="flex w-4/12 items-center ">
                  <label className="ml-2 w-1/4 text-sm text-gray-400">
                    From Name:
                  </label>
                  <input value="Miguel" className="mx-2 my-1 flex-grow p-1" />
                  <Icon
                    IconSource={TagFilledIcon}
                    DecorationClass="mr-2 mt-2"
                  />
                  <label>More</label>
                  <Icon
                    IconSource={CaretIcon}
                    DecorationClass="h-3 w-3 mt-2 ml-2"
                  />
                </span>
              </div>
              <EmailEditor
                ref={emailEditorRef}
                onLoad={onLoad}
                onReady={onReady}
              />
              <input hidden type="submit" ref={submitRef} />
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
