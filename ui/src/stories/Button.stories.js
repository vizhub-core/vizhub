import { Button } from "../components/Button";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
export default {
  title: "VizHub/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: { onClick: { action: "clicked" } },
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary = {
  args: {
    variant: "primary",
    children: "Button",
  },
};

export const Secondary = {
  args: {
    variant: "secondary",
    children: "Button",
  },
};

export const Large = {
  args: {
    size: "lg",
    children: "Button",
  },
};

export const Small = {
  args: {
    size: "sm",
    children: "Button",
  },
};
