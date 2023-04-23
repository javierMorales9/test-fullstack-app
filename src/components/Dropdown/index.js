import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "~/components/Button";
import Link from "next/link";
import styles from "./Dropdown.module.css";

const DropdownContext = createContext({
  open: false,
  toggleDropdown: () => {},
});

const Dropdown = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleDropdown = () => {
    setOpen((prevState) => !prevState);
  };
  const hideDropdown = () => {
    setOpen(false);
  };

  return (
    <DropdownContext.Provider value={{ open, toggleDropdown, hideDropdown }}>
      <div className={styles.dropdown}>{children}</div>
    </DropdownContext.Provider>
  );
};

export default Dropdown;

const DropdownButton = ({ className, children, ...restProps }) => {
  const inputRef = useRef();

  const { toggleDropdown, hideDropdown } = useContext(DropdownContext);
  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        hideDropdown();
      }
    };
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  return (
    <Button
      ref={inputRef}
      onClick={toggleDropdown}
      type="button"
      className={className}
      {...restProps}
    >
      {children}
      {/*<svg*/}
      {/*  className="-mr-1 ml-2 h-5 w-5"*/}
      {/*  xmlns="http://www.w3.org/2000/svg"*/}
      {/*  viewBox="0 0 20 20"*/}
      {/*  fill="currentColor"*/}
      {/*  aria-hidden="true"*/}
      {/*>*/}
      {/*  <path*/}
      {/*    fillRule="evenodd"*/}
      {/*    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"*/}
      {/*    clipRule="evenodd"*/}
      {/*  />*/}
      {/*</svg>*/}
    </Button>
  );
};
DropdownButton.displayName = "Dropdown Button";
Dropdown.Button = DropdownButton;

const DropdownMenu = ({ className = "", children }) => {
  const { open } = useContext(DropdownContext);
  return (
    open && (
      <div
        className={`${className} ${styles.menu}`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex="-1"
      >
        {children}
      </div>
    )
  );
};
DropdownMenu.displayName = "Dropdown Menu";
Dropdown.Menu = DropdownMenu;

const DropdownLink = ({ as = "a", children, href, className, ...props }) => {
  if (href) {
    return (
      <Link href={href} className={`${className} ${styles.link}`} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <Button
      variant={props.variant || "clean"}
      className={`${className} ${styles.link}`}
      {...props}
    >
      {children}
    </Button>
  );
};
DropdownLink.displayName = "Dropdown Link";
Dropdown.Link = DropdownLink;
