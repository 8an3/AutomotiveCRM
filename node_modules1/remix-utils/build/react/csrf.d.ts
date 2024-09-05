import { ReactNode } from "react";
export interface AuthenticityTokenProviderProps {
    children: ReactNode;
    token: string;
}
export interface AuthenticityTokenInputProps {
    name?: string;
}
/**
 * Save the Authenticity Token into context
 * Example: In the `root` add `<AuthenticityTokenProvider>`
 * ```tsx
 * let { csrf } = useLoaderData<{ csrf: string }>();
 * return (
 *   <AuthenticityTokenProvider token={csrf}>
 *     <Document>
 *       <Outlet />
 *     </Document>
 *   </AuthenticityTokenProvider>
 * )'
 * ```
 */
export declare function AuthenticityTokenProvider({ children, token, }: AuthenticityTokenProviderProps): JSX.Element;
/**
 * Get the authenticity token, this should be used to send it in a submit.
 * @example
 * let token = useAuthenticityToken();
 * let submit = useSubmit();
 * function sendFormWithCode() {
 *   submit(
 *     { csrf: token, ...otherData },
 *     { action: "/action", method: "post" },
 *   );
 * }
 */
export declare function useAuthenticityToken(): string;
/**
 * Render a hidden input with the name csrf and the authenticity token as value.
 * ```tsx
 * return (
 *   <Form action="/login" method="post">
 *     <AuthenticityTokenInput />
 *     <input name="email" type="email" />
 *     <input name="password" type="password" />
 *     <button type="submit">Login</button>
 *   </Form>
 * );
 * ```
 */
export declare function AuthenticityTokenInput({ name, }: AuthenticityTokenInputProps): JSX.Element;
