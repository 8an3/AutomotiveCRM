import { conform, parse, useForm } from "@conform-to/react";
import { parse as parseZod } from "@conform-to/zod";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect } from "react";
import { badRequest, forbidden } from "remix-utils";

import {
  Alert,
  ButtonLoading,
  ButtonCopy,
  Debug,
  Input,
  InputPassword,
  Label,
  PageHeader,
  RemixForm,
  RemixLinkText,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextArea,
} from "~/components";
import { requireUserSession } from "~/helpers";
import { Settings } from "~/icons";
import { model } from "~/models";
import {
  schemaUserUpdateData,
  schemaUserUpdatePassword,
  schemaUserUpdateProfile,
} from "~/schemas";
import { createSitemap } from "~/utils";
import { getSession } from "~/sessions/auth-session.server";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { z } from "zod";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";

export const handle = createSitemap();

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  return json({ user });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const parsed = parse(formData);
  const { intent } = parsed.payload;

  if (intent === "update-user-data") {
    const submission = parseZod(formData, { schema: schemaUserUpdateData });
    if (!submission.value) {
      return badRequest(submission);
    }
    const result = await model.user.mutation.update(submission.value);
    if (result?.error) {
      return forbidden({ ...submission, error: result.error });
    }
    return json(submission);
  }

  if (intent === "update-user-profile") {
    const submission = parseZod(formData, { schema: schemaUserUpdateProfile });
    if (!submission.value) {
      return badRequest(submission);
    }
    const result = await model.userProfile.mutation.update(submission.value);
    if (result.error) {
      return forbidden({ ...submission, error: result.error });
    }
    return json(submission);
  }

  if (intent === "update-user-password") {
    const submission = parseZod(formData, { schema: schemaUserUpdatePassword });
    if (!submission.value) {
      return badRequest(submission);
    }
    const result = await model.userPassword.mutation.update(submission.value);
    if (result.error) {
      return forbidden({ ...submission, error: result.error });
    }
    return json(submission);
  }

  return json(parsed);
}

export default function Route3() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="contain-sm">
      <PageHeader size="xs" withBackground={false} withContainer={false}>
        <h1 className="queue-center text-3xl">
          <Settings className="size-lg" />
          Change Password
        </h1>

      </PageHeader>

      <section>
        <UserSettingsTabPassword />
      </section>

      <Debug name="user">{user}</Debug>
    </div>
  );
}




function UserSettingsTabPassword() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [form, { id, password, confirmPassword }] = useForm<
    z.infer<typeof schemaUserUpdatePassword>
  >({
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    onValidate({ formData }) {
      return parseZod(formData, { schema: schemaUserUpdatePassword });
    },
  });

  /**
   * Reset form fields after submitting
   * Can work with Conform if the input has defaultValue of empty string
   */
  useEffect(() => {
    if (!isSubmitting) {
      form.ref.current?.reset();
    }
  }, [isSubmitting, form.ref]);

  return (
    <div>
      <RemixForm {...form.props} replace method="PUT" className="max-w-sm">
        <fieldset
          disabled={isSubmitting}
          className="space-y-2 disabled:opacity-80"
        >
          <input hidden {...conform.input(id)} defaultValue={user.id} />

          <div className="space-y-1">
            <Label htmlFor={password.id}>New Password</Label>
            <InputPassword
              {...conform.input(password)}
              placeholder="Your new password"
              defaultValue=""
            />
            {password.error && (
              <Alert variant="danger" id={password.errorId}>
                {password.error}
              </Alert>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor={confirmPassword.id}>Confirm New Password</Label>
            <InputPassword
              {...conform.input(confirmPassword)}
              placeholder="Confirm your new password"
              defaultValue=""
            />
            {confirmPassword.error && (
              <Alert variant="danger" id={confirmPassword.errorId}>
                {confirmPassword.error}
              </Alert>
            )}
          </div>

          <div className="queue-center">
            <ButtonLoading
              type="submit"
              name="intent"
              value="update-user-password"
              isSubmitting={isSubmitting}
              loadingText="Updating Password..."
              className="grow"
            >
              Update Password
            </ButtonLoading>
          </div>
        </fieldset>
      </RemixForm>
    </div>
  );
}
