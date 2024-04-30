import { Container } from "@radix-ui/themes";
import { Outlet } from "@remix-run/react";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { NavigationMenuSales } from '~/components/shared/navMenu'

export default function Quote() {
  /**
  <UnauthenticatedTemplate>
   *
   </UnauthenticatedTemplate>
   */
  return (
    <>
      <NavigationMenuSales />

      <Outlet />
    </>
  );
}
