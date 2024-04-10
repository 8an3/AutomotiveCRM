import { Container } from "@radix-ui/themes";
import { Outlet } from "@remix-run/react";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

export default function Quote() {
  return (
    <>
      <UnauthenticatedTemplate>
        <Outlet />
      </UnauthenticatedTemplate>
    </>
  );
}
