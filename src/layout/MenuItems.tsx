import {
  UilArrowGrowth,
  UilDashboard,
  UilUsersAlt,
  UilEllipsisV,
  UilAnalytics,
  UilAlignAlt,
  UilCube,
  UilApps,
  UilExchange,
  UilSlidersVAlt,
  UilFileContract,
  UilTicket,
  UilBell,
  UilFileInfoAlt,
} from "@iconscout/react-unicons";
import React, { useState, useEffect } from "react";
import { Menu, Skeleton } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  changeMenuMode,
  changeDirectionMode,
  changeLayoutMode,
} from "../redux/themeLayout/actionCreator";
import { currentAdmin } from "@/functions/auth";

function MenuItems() {
  const path = "/admin";
  const { t } = useTranslation();
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = Cookies.get("access_token");
    // console.log("TOKEN", token);
    if (token != undefined) {
      currentAdmin(token).then((res: any) => {
        // console.log("RES PARTNER", res);
        if (res.name == "JsonWebTokenError") {
          // dispatch(logOutAction(() => router.push('/')));
          Cookies.set("loggedIn", false.toString());
          Cookies.set("access_token", "");
          router.push("/");
        }
        if (res.data.success) {
          setUser(res.data.admin);
          setLoading(false);
          // console.log("Logged in", res.data);
        } else {
          Cookies.set("loggedIn", false.toString());
          Cookies.set("access_token", "");
          router.push("/");
        }
      });
    }
  }, []);
  interface RootState {
    ChangeLayoutMode: {
      topMenu: string;
    };
  }

  const { topMenu } = useSelector((state: RootState) => {
    return {
      topMenu: state.ChangeLayoutMode.topMenu,
    };
  });

  const router = useRouter();
  const { pathname } = router;
  const pathArray = pathname && pathname !== "/" ? pathname.split(path) : [];
  const mainPath = pathArray.length > 1 ? pathArray[1] : "";
  const mainPathSplit = mainPath.split("/");

  const [openKeys, setOpenKeys] = React.useState(
    !topMenu
      ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : "dashboard"}`]
      : [],
  );
  const [openItems, setOpenItems] = React.useState(
    !topMenu
      ? [
          `${
            mainPathSplit.length === 1
              ? "demo-1"
              : mainPathSplit.length === 2
                ? mainPathSplit[1]
                : mainPathSplit[2]
          }`,
        ]
      : [],
  );

  useEffect(() => {
    // Check if the current route matches the base path.
    if (pathname === path) {
      setOpenKeys(["dashboard"]); // active menu key.
      setOpenItems(["demo-1"]); // active menu item.
    }
  }, [pathname]);

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(
      keys[keys.length - 1] !== "recharts" && keys.length > 0
        ? [keys[keys.length - 1]]
        : keys,
    );
  };

  const onClick = (item: any) => {
    setOpenItems([item.key]);
    if (item.keyPath.length === 1) setOpenKeys([]);
  };

  const dispatch = useDispatch();

  const changeNavbar = (topMode: boolean) => {
    const html: HTMLElement | null = document.querySelector("html");
    if (html) {
      if (topMode) {
        html.classList.add("hexadash-topmenu");
      } else {
        html.classList.remove("hexadash-topmenu");
      }
    }
    //@ts-ignore
    dispatch(changeMenuMode(topMode));
  };

  const changeLayoutDirection = (rtlMode: boolean) => {
    if (rtlMode) {
      const html: HTMLElement | null = document.querySelector("html");

      if (html) {
        html.setAttribute("dir", "rtl");
      }
    } else {
      const html: HTMLElement | null = document.querySelector("html");

      if (html) {
        html.setAttribute("dir", "ltr");
      }
    }
    //@ts-ignore
    dispatch(changeDirectionMode(rtlMode));
  };

  const changeLayout = (mode: string) => {
    //@ts-ignore
    dispatch(changeLayoutMode(mode));
  };

  const darkmodeActivated = () => {
    document.body.classList.add("dark");
  };

  const darkmodeDiactivated = () => {
    document.body.classList.remove("dark");
  };

  function getItem(
    label: React.ReactNode,
    key: string,
    icon: any,
    children: any,
  ) {
    return {
      label,
      key,
      icon,
      children,
    };
  }

  const items = [
    getItem(
      <Link href={`${path}`}>{t("dashboard")}</Link>,
      "dashboard",
      !topMenu && <UilDashboard />,
      null,
    ),
    // getItem(
    //   <Link href={`${path}/pages/changelog`}>
    //     {t("changelog")}
    //     <span className="badge badge-primary menuItem">
    //       {versions[0].version}
    //     </span>
    //   </Link>,
    //   "changelog",
    //   !topMenu && <UilArrowGrowth />,
    //   null
    // ),
    getItem(
      !topMenu && (
        <p className="flex text-[12px] font-medium uppercase text-theme-gray mt-[20px] dark:text-white/60 pe-[15px]">
          {t("master data")}
        </p>
      ),
      "app-title",
      null,
      null,
    ),
    // Users
    getItem(t("users"), "users", !topMenu && <UilUsersAlt />, [
      user.role == "superadmin" &&
        getItem(
          <Link href={`${path}/users/admin`}>{t("List Admins")}</Link>,
          "list-admin",
          null,
          null,
        ),
      getItem(
        <Link href={`${path}/users/partner`}>{t("List Partners")}</Link>,
        "list-partner",
        null,
        null,
      ),
      getItem(
        <Link href={`${path}/users/customer`}>{t("List Customers")}</Link>,
        "list-customer",
        null,
        null,
      ),
      getItem(
        <Link href={`${path}/users/engineer`}>{t("List Engineers")}</Link>,
        "list-engineer",
        null,
        null,
      ),
    ]),
    // Submission
    getItem("Submissions", "submissions", !topMenu && <UilFileInfoAlt />, [
      getItem(
        <Link href={`${path}/submissions`}>List Submissions</Link>,
        "list-submissions",
        null,
        null,
      ),
    ]),
    // Skill
    getItem(t("Skills Data"), "skills", !topMenu && <UilAnalytics />, [
      getItem(
        <Link href={`${path}/skills`}>{t("List Skill")}</Link>,
        "list-skill",
        null,
        null,
      ),
    ]),
    // Categories
    getItem(t("Categories"), "categories", !topMenu && <UilAlignAlt />, [
      getItem(
        <Link href={`${path}/categories`}>{t("List Category")}</Link>,
        "list-category",
        null,
        null,
      ),
      getItem(
        <Link href={`${path}/subcategories`}>{t("List Subcategory")}</Link>,
        "list-subcategory",
        null,
        null,
      ),
    ]),
    // Brands
    getItem(t("Brands"), "brands", !topMenu && <UilCube />, [
      getItem(
        <Link href={`${path}/brands`}>{t("List Brand")}</Link>,
        "list-brand",
        null,
        null,
      ),
    ]),

    getItem(
      !topMenu && (
        <p className="flex text-[12px] font-medium uppercase text-theme-gray mt-[20px] dark:text-white/60 pe-[15px]">
          {t("transactions")}
        </p>
      ),
      "transactions-div",
      null,
      null,
    ),
    // Contracts
    getItem(t("Contracts"), "contracts", !topMenu && <UilFileContract />, [
      getItem(
        <Link href={`${path}/contracts/customer`}>
          {t("Customer Contracts")}
        </Link>,
        "list-contract",
        null,
        null,
      ),
      getItem(
        <Link href={`${path}/contracts/business-partner`}>
          {t("Business Partner Contracts")}
        </Link>,
        "list-bp-contract",
        null,
        null,
      ),
      getItem(
        <Link href={`${path}/contracts/service-partner`}>
          {t("Service Partner Contracts")}
        </Link>,
        "list-sp-contract",
        null,
        null,
      ),
    ]),
    // Transaction
    getItem(t("Ticketing"), "ticketing", !topMenu && <UilTicket />, [
      getItem(
        <Link href={`${path}/ticketing`}>{t("List Ticket")}</Link>,
        "list-ticket",
        null,
        null,
      ),
    ]),
    getItem(t("Invoice"), "invoice", !topMenu && <UilExchange />, [
      getItem(
        <Link href={`${path}/invoice`}>{t("List invoice")}</Link>,
        "list-invoice",
        null,
        null,
      ),
    ]),
    getItem(
      !topMenu && (
        <p className="flex text-[12px] font-medium uppercase text-theme-gray mt-[20px] dark:text-white/60 pe-[15px]">
          {t("Settings & Misc")}
        </p>
      ),
      "settings-misc",
      null,
      null,
    ),
    // Settings
    user &&
      user.role == "superadmin" &&
      getItem(t("Settings"), "settings", !topMenu && <UilSlidersVAlt />, [
        getItem(
          <Link href={`${path}/settings`}>{t("General Settings")}</Link>,
          "general-settings",
          null,
          null,
        ),
        getItem(
          <Link href={`${path}/settings/app-settings`}>
            {t("App Settings")}
          </Link>,
          "app-settings",
          null,
          null,
        ),
        getItem(
          <Link href={`${path}/settings/web-settings`}>
            {t("Web Settings")}
          </Link>,
          "web-settings",
          null,
          null,
        ),
        getItem(
          <Link href={`${path}/settings/invoice-setting`}>
            {t("Invoice Settings")}
          </Link>,
          "invoice-settings",
          null,
          null,
        ),
      ]),
    getItem(t("Notification"), "notification", !topMenu && <UilBell />, [
      getItem(
        <Link href={`${path}/notification/broadcast`}>
          {t("Broadcast Notification")}
        </Link>,
        "broadcast-notification",
        null,
        null,
      ),
    ]),
  ];

  return (
    <>
      {loading ? (
        <Skeleton active />
      ) : (
        <Menu
          onClick={onClick}
          onOpenChange={onOpenChange}
          mode={!topMenu || window.innerWidth <= 991 ? "inline" : "horizontal"}
          defaultSelectedKeys={openKeys}
          defaultOpenKeys={openItems}
          overflowedIndicator={<UilEllipsisV />}
          openKeys={openKeys}
          selectedKeys={openItems}
          items={items}
        />
      )}
    </>
  );
}

export default MenuItems;
