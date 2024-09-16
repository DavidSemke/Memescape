import Logo from "../../image/Logo"

export default function Footer() {
  return (
    <footer className="z-20 flex w-full flex-col items-center border-t-2 border-stress-tertiary bg-primary p-4">
      <Logo
        title={true}
        slogan={true}
        attrs={{
          slogan: {
            className: "hidden sm:block",
          },
        }}
      />
      <div className="mt-2 w-full border-t-2 border-stress-secondary pt-2 text-center text-xs">
        © 2024 Memescape. All rights reserved.
      </div>
    </footer>
  )
}
