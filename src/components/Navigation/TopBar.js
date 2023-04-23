import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import routes from "~/utils/routes";
import useUser from "~/contexts/userContext";
import logo from "public/images/logo-primary.svg";
import FlowsIcon from "public/images/icons/flows.inline.svg";
import UserIcon from "public/images/icons/account_circle.svg";
import Button from "~/components/Button";
import Dropdown from "~/components/Dropdown";
import styles from "./TopBar.module.css";
import UsersNav from "public/images/icons/users_nav.svg";
import Icon from "~/components/Icon";
import EmailNav from "public/images/icons/emails_nav.svg";
import ManageNav from "public/images/icons/manage_nav.svg";
import { Popover } from "@headlessui/react";
import CaretRightIcon from "public/images/icons/caret_right.svg";
import TagsIcon from "public/images/icons/tags.svg";
import FieldsIcon from "public/images/icons/fields.svg";
import classnames from "classnames";

function ManageDropdown() {
  return (
    <Popover as="div" className="relative">
      <Popover.Button className={classnames(styles.tab, "outline-none")}>
        {({ open }) => (
          <>
            <Icon IconSource={ManageNav} DecorationClass={styles.icon} />
            Manage
            <Icon
              IconSource={CaretRightIcon}
              DecorationClass={classnames(styles.menubarCaret, "mt-1", {
                "rotate-90": open,
              })}
            />
          </>
        )}
      </Popover.Button>
      <Popover.Panel className={classnames(styles.menubarPanel)}>
        <Link href={routes.tags} as="a">
          <p>
            <Icon IconSource={TagsIcon} DecorationClass={"ml-1 mt-1 mr-2"} />
            Tags
          </p>
        </Link>
        <hr />
        <hr />
        <Link href={routes.fields}>
          <p>
            <Icon IconSource={FieldsIcon} DecorationClass={"ml-2 mr-3"} />
            Fields
          </p>
        </Link>
      </Popover.Panel>
    </Popover>
  );
}

const links = [
  {
    id: 2,
    title: "Automations",
    Icon: () => <FlowsIcon />,
    href: routes.automations,
    value: "automations",
  },
  {
    id: 3,
    title: "Users",
    Icon: () => <Icon IconSource={UsersNav} DecorationClass={""} />,
    href: routes.users,
    value: "users",
  },
  {
    id: 4,
    title: "Emails",
    Icon: () => <Icon IconSource={EmailNav} DecorationClass={""} />,
    href: routes.emails,
    value: "emails",
  },
  {
    id: 5,
    title: "Manage",
    Icon: () => <Icon IconSource={ManageNav} DecorationClass={""} />,
    href: routes.automations,
    value: "manage",
    renderer: function () {
      return <ManageDropdown />;
    },
  },
];

const TopBar = ({ active }) => {
  const { logout, accountData } = useUser();

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <div>
          <Link href={routes.home} className={styles.logo}>
            <Image
              src={logo}
              layout={"fill"}
              objectFit={"contain"}
              objectPosition={"center"}
              alt={"Clickout Logo"}
            />
          </Link>
        </div>
        <div className={styles.tabs}>
          {links.map(({ id, title, Icon, href, value, renderer = null }) =>
            renderer ? (
              <div key={id}>{renderer()}</div>
            ) : (
              <Link
                key={id}
                href={href}
                className={`${styles.tab} ${
                  value === active ? styles.active : ""
                }`}
              >
                <span className={styles.icon}>
                  <Icon />
                </span>
                {title}
              </Link>
            ),
          )}
        </div>
        <div className={styles.settings}>
          <Dropdown>
            <Dropdown.Button className={styles.button} variant={"outline"}>
              {accountData?.imageUrl ? (
                <Image
                  alt={"Company Logo"}
                  className={styles.companyLogo}
                  src={accountData?.imageUrl}
                />
              ) : (
                <Image
                  src={UserIcon}
                  layout={"fill"}
                  objectFit={"contain"}
                  objectPosition={"center"}
                  alt={"Generic Profile Image"}
                />
              )}
              {/*<Image src={UserIcon} height={32} width={32} />*/}
            </Dropdown.Button>
            <Dropdown.Menu>
              <div role="none">
                <Dropdown.Link href={routes.settingsConfigurationCompany}>
                  Account
                </Dropdown.Link>
              </div>
              <div role={"none"}>
                <Button
                  weight={"normal"}
                  className={"w-full"}
                  align={"left"}
                  variant={"clean"}
                  type="button"
                  tabIndex="-1"
                  onClick={logout}
                >
                  Sign out
                </Button>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

TopBar.propTypes = {
  active: PropTypes.oneOf(links.map(({ value }) => value)),
};

export default TopBar;
