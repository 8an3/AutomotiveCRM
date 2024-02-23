import { json } from "@remix-run/node";
import { prisma } from "~/libs";

export async function templateServer(id, data, intent) {
  let template;
  console.log("hit templaste server", intent, " = intent", data, "= data");

  if (!id) {
    console.log("createTemplate", data);
    template = await prisma.emailTemplates.create({
      data: {
        ...data,
      },
    });
    return template;
  }
  if (intent === "updateTemplate") {
    console.log("updateTemplate", data);
    template = await prisma.emailTemplates.update({
      data: {
        ...data,
      },
      where: {
        id: id,
      },
    });
    return template;
  }
  if (intent === "deleteTemplate") {
    console.log("deleteTemplate", data);
    template = await prisma.emailTemplates.delete({
      where: {
        id: id,
      },
    });
    return template;
  }
  return template;
}

export async function getTemplatesByEmail(userEmail) {
  // console.log(userEmail, " = userEmail in templates server");
  try {
    const templates = await prisma.emailTemplates.findMany({
      where: {
        userEmail: userEmail,
      },
    });
    // console.log(templates, " = templates in templates server");
    return templates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
}
