import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import routes from "~/utils/routes";

import ConfigurationIcon from "public/images/icons/settings-configuration.inline.svg";
import PlanIcon from "public/images/icons/settings-plan.inline.svg";
import HelpIcon from "public/images/icons/settigs-help.inline.svg";
import IntegrationIcon from "public/images/icons/settings.integration.inline.svg";
import ScriptIcon from "public/images/icons/settings.script.inline.svg";
import { h2 } from "~/styles/styles.module.css";
import styles from "./Sidebar.module.css";

const links = [
  {
    id: 1,
    title: "Configuration",
    Icon: () => <ConfigurationIcon />,
    href: routes.settings,
    value: "configuration",
  },
  // {
  //   id: 2,
  //   title: 'My plan',
  //   Icon: () => <PlanIcon />,
  //   href: routes.settingsPlan,
  //   value: 'plan',
  // },
  {
    id: 3,
    title: "Help",
    Icon: () => <HelpIcon />,
    href: routes.settingsHelp,
    value: "help",
  },
  {
    id: 4,
    title: "Integrations",
    Icon: () => <IntegrationIcon />,
    href: routes.settingsIntegration,
    value: "integration",
  },
  {
    id: 5,
    title: "Script",
    Icon: () => <ScriptIcon />,
    href: routes.settingsScript,
    value: "script",
  },
];

const Sidebar = ({ active }) => {
  return (
    <>
      <h2 className={h2}>My Account</h2>
      <p className={styles.info}>Manage your Clickout account</p>
      <div className={styles.wrapper}>
        {links.map(({ id, title, Icon, href, value }) => (
          <Link key={id} href={href}>
            <a
              className={`${styles.link} ${
                value === active ? styles.active : ""
              }`}
            >
              <span className={styles.icon}>
                <Icon />
              </span>
              {title}
            </a>
          </Link>
        ))}
      </div>
    </>
  );
};

Sidebar.propTypes = {
  active: PropTypes.oneOf(links.map(({ value }) => value)),
};

export default Sidebar;
