import {
  Anchor,
  AnchorText,
  ButtonIconAnchor,
  TextCode,
  ThemeToggleDropdownMenu,
} from "~/components";
import { configMeta, configSite } from "~/configs";
import { Github, Twitter } from "~/icons";
import { cn, getCurrentYear } from "~/utils";

interface Props {
}

export function SiteFooter() {
  return (
    <footer
      className={cn(
        "bg-text-raised", // background
        "border-t-2  ", // border
        "mt-60 py-4 sm:py-8"
      )}
    >

    </footer>
  );
}
