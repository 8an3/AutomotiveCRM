
import { useAppContext } from "~/components/microsoft/AppContext";
import { useState, useEffect } from 'react'
import { Button, Input } from "~/components";
import { Form } from "@remix-run/react";
import { CheckIcon, PaperPlaneIcon, PlusIcon, UploadIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { ActionFunction, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData, writeAsyncIterableToWritable } from "@remix-run/node";
import { Readable } from 'stream';
import { getSession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";

export const action: ActionFunction = async ({ req, request, params }) => {

  return null

}
