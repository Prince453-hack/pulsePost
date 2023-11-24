export default function SidebarMenuItem({ name, Icon, active }) {
  return (
    <div className="hoverEffect flex items-center text-gray-100 justify-center xl:justify-start text-lg space-x-3">
      <Icon className="h-7" />
      <span className={`${active && "font-bold"} hidden xl:inline`}>
        {name}
      </span>
    </div>
  );
}
