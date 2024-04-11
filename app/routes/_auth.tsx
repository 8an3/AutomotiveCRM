import { Container } from "@radix-ui/themes";
import { Outlet } from "@remix-run/react";
import { UnauthenticatedTemplate } from "@azure/msal-react";

export default function Quote() {
  return (
    <>
      <UnauthenticatedTemplate>
        <Container width='100%' height='100%' left='auto' top='auto' className="w-full h-full min-h-screen  px-2 sm:px-1 lg:px-3 bg-black border-gray-300 font-bold uppercase  ">
          <Outlet />
        </Container>
      </UnauthenticatedTemplate>
    </>
  );
}
