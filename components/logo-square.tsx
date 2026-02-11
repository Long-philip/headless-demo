import clsx from "clsx";
import Image from "next/image";
import joyLogo from "app/asset/joy-logo.webp";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center overflow-hidden rounded-xl",
        {
          "h-[40px] w-[40px]": !size,
          "h-[30px] w-[30px] rounded-lg": size === "sm",
        },
      )}
    >
      <Image
        src={joyLogo}
        alt="Logo"
        className="h-full w-full object-cover"
        width={40}
        height={40}
      />
    </div>
  );
}
