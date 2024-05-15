import { Container } from "@radix-ui/themes";
import { Outlet } from "@remix-run/react";

export default function Quote() {
  return (
    <>
      <Container width='100%' height='100%' left='auto' top='auto' className="w-full h-full min-h-screen  px-2 sm:px-1 lg:px-3 bg-[#09090b] border-gray-300 font-bold uppercase  ">
        <Outlet />
      </Container>
    </>
  );
}
