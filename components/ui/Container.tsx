import { cn } from "@/lib/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
};

export default function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[1320px] px-5 sm:px-6 md:px-12 lg:px-16",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
