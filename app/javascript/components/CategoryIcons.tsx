import React from "react";
import SVG from "react-inlinesvg";

export const categories = [
  {
    key: "droplet",
    label: "Droplet",
    icon: require("../../assets/images/category_icons/droplet.svg"),
  },
  {
    key: "hospital",
    label: "Hospital",
    icon: require("../../assets/images/category_icons/hospital.svg"),
  },
  {
    key: "heart",
    label: "Heart",
    icon: require("../../assets/images/category_icons/heart.svg"),
  },
  {
    key: "hand",
    label: "Hand",
    icon: require("../../assets/images/category_icons/hand.svg"),
  },
  {
    key: "account",
    label: "Account",
    icon: require("../../assets/images/category_icons/account.svg"),
  },
  {
    key: "shopping_cart",
    label: "Shopping Cart",
    icon: require("../../assets/images/category_icons/shopping_cart.svg"),
  },
  {
    key: "schedule",
    label: "Schedule",
    icon: require("../../assets/images/category_icons/schedule.svg"),
  },
  {
    key: "pets",
    label: "Pets",
    icon: require("../../assets/images/category_icons/pets.svg"),
  },
  {
    key: "extension",
    label: "Extension",
    icon: require("../../assets/images/category_icons/extension.svg"),
  },
  {
    key: "hourglass",
    label: "Hourglass",
    icon: require("../../assets/images/category_icons/hourglass.svg"),
  },
  {
    key: "brightness",
    label: "Brightness",
    icon: require("../../assets/images/category_icons/brightness.svg"),
  },
  {
    key: "offline",
    label: "Offline",
    icon: require("../../assets/images/category_icons/offline.svg"),
  },
  {
    key: "security",
    label: "Security",
    icon: require("../../assets/images/category_icons/security.svg"),
  },
  {
    key: "waves",
    label: "Waves",
    icon: require("../../assets/images/category_icons/waves.svg"),
  },
  {
    key: "events",
    label: "Events",
    icon: require("../../assets/images/category_icons/events.svg"),
  },
  {
    key: "satisfied",
    label: "Satisfied",
    icon: require("../../assets/images/category_icons/satisfied.svg"),
  },
  {
    key: "city",
    label: "City",
    icon: require("../../assets/images/category_icons/city.svg"),
  },
  {
    key: "objects",
    label: "Objects",
    icon: require("../../assets/images/category_icons/objects.svg"),
  },
  {
    key: "walk",
    label: "Walk",
    icon: require("../../assets/images/category_icons/walk.svg"),
  },
  {
    key: "palette",
    label: "Palette",
    icon: require("../../assets/images/category_icons/palette.svg"),
  },
  {
    key: "note",
    label: "Note",
    icon: require("../../assets/images/category_icons/note.svg"),
  },
  {
    key: "sunny",
    label: "Sunny",
    icon: require("../../assets/images/category_icons/sunny.svg"),
  },
  {
    key: "controlpoint",
    label: "Control Point",
    icon: require("../../assets/images/category_icons/controlpoint.svg"),
  },
  {
    key: "landscape",
    label: "Landscape",
    icon: require("../../assets/images/category_icons/landscape.svg"),
  },
  {
    key: "chatbubble",
    label: "Chat Bubble",
    icon: require("../../assets/images/category_icons/chatbubble.svg"),
  },
  {
    key: "phonelink",
    label: "Phone Link",
    icon: require("../../assets/images/category_icons/phonelink.svg"),
  },
  {
    key: "bike",
    label: "Bike",
    icon: require("../../assets/images/category_icons/bike.svg"),
  },
  {
    key: "bar",
    label: "Bar",
    icon: require("../../assets/images/category_icons/bar.svg"),
  },
  {
    key: "list",
    label: "List",
    icon: require("../../assets/images/category_icons/list.svg"),
  },
  {
    key: "fitness",
    label: "Fitness",
    icon: require("../../assets/images/category_icons/fitness.svg"),
  },
  {
    key: "spa",
    label: "Spa",
    icon: require("../../assets/images/category_icons/spa.svg"),
  },
  {
    key: "golf",
    label: "Golf",
    icon: require("../../assets/images/category_icons/golf.svg"),
  },
  {
    key: "asthma",
    label: "Asthma",
    icon: require("../../assets/images/category_icons/asthma.svg"),
  },
  {
    key: "copd",
    label: "Copd",
    icon: require("../../assets/images/category_icons/copd.svg"),
  },
  {
    key: "covid-19",
    label: "Covid-19",
    icon: require("../../assets/images/category_icons/covid-19.svg"),
  },
  {
    key: "depression",
    label: "Depression",
    icon: require("../../assets/images/category_icons/depression.svg"),
  },
  {
    key: "flu_test",
    label: "Flu test",
    icon: require("../../assets/images/category_icons/flu_test.svg"),
  },
  {
    key: "hypertension",
    label: "Hypertension",
    icon: require("../../assets/images/category_icons/hypertension.svg"),
  },
  {
    key: "immunization",
    label: "Immunization",
    icon: require("../../assets/images/category_icons/immunization.svg"),
  },
  {
    key: "tuberclosis",
    label: "Tuberclosis",
    icon: require("../../assets/images/category_icons/tuberclosis.svg"),
  },
] as const;

type NameType = (typeof categories)[number]["key"];

interface Props {
  name: NameType;
  className?: string;
  width?: number;
  height?: number;
  fill?: string;
}

const CategoryIcons: React.FC<Props> = ({
  name,
  className,
  width = 16,
  height = 16,
  fill,
}: Props) => {
  const category = categories.find((item) => item.key === name);
  console.log('name')
  console.log(name)
  console.log('category')
  console.log(category)
  return (
    category && (
      <SVG
        className={className}
        src={category.icon}
        width={width}
        height={height}
        fill={fill}
        aria-placeholder={category.label}
      />
    )
  );
};

export default CategoryIcons;