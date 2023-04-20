import React, { createContext, useContext } from "react";
import classnames from "classnames";
import { Disclosure } from "@headlessui/react";

const AccordionContext = createContext({ open: false });

function Accordion({ children }: { children: React.ReactNode }) {
  return (
    <Disclosure>
      {({ open }) => (
        <AccordionContext.Provider value={{ open: open }}>
          {children}
        </AccordionContext.Provider>
      )}
    </Disclosure>
  );
}

function AccordionHeader({
  children,
}: {
  children: React.ReactNode | ((open: boolean) => React.ReactNode);
}) {
  const { open } = useContext(AccordionContext);
  return (
    <Disclosure.Button>
      {typeof children === "function" ? children(open) : children}
    </Disclosure.Button>
  );
}

function AccordionBody({
  children,
}: {
  children: React.ReactNode | ((open: boolean) => React.ReactNode);
}) {
  const { open } = useContext(AccordionContext);
  return (
    <div
      className={classnames("overflow-hidden", {
        "max-h-0": !open,
        "max-h-screen": open,
      })}
      style={{
        transition: "all 0.35s",
      }}
    >
      <Disclosure.Panel static>
        {typeof children === "function" ? children(open) : children}
      </Disclosure.Panel>
    </div>
  );
}

export default Accordion;

Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;
