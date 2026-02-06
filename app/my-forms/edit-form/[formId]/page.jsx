"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../../config";
import { JsonForms } from "../../../../config/schema";
import { and, eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Code,
  Loader,
  Monitor,
  Share2,
  SquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import FormUi from "../_components/FormUi";
import { toast } from "sonner";
import Controller from "../_components/Controller";
import { ShareButton } from "@/app/_components/ShareButton";
import { ProtectedPage } from "@/app/_components/Protected";
import Loading from "@/app/_components/Loading";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const EditForm = () => {
  const params = useParams();
  const { user } = useUser();
  const [jsonForm, setJsonForm] = useState([]);
  const pathname = usePathname();
  const [updateTrigger, setUpdateTrigger] = useState();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [selectedBackground, setSelectedBackground] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [signInEnabled, setSignInEnabled] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    user && GetFormData();
  }, [user]);

  const GetFormData = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(
          and(
            eq(JsonForms.id, Number(params?.formId)),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );

      setRecord(result[0]);
      setJsonForm(JSON.parse(result[0].jsonform));
      setSelectedTheme(result[0].theme);
      setSelectedBackground(result[0].background);
      console.log("Setting Record:", result[0]);
      console.log("Setting JSON Form:", JSON.parse(result[0].jsonform));
      setIsTemplate(result[0].isTemplate);
      setSelectedStyle(JSON.parse(result[0].style));
      setIsActive(result[0].isActive);
      setSignInEnabled(result[0].enabledSignIn);
      setLoading(false);
    } catch (error) {
      setError(error);
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (updateTrigger) {
      setJsonForm(jsonForm);
      updateJsonFormInDb();
    }
  }, [updateTrigger]);

  const formUrl = process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + record?.id;

  const embedCode = `<iframe src="${formUrl}" width="100%" height="600px" frameborder="0" allowfullscreen></iframe>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied to clipboard!");
  };

  const toCamelCase = (str) => {
    return str
      .replace(/\s(.)/g, (match) => match.toUpperCase()) // Capitalize letters after spaces
      .replace(/\s/g, "") // Remove spaces
      .replace(/^./, (match) => match.toLowerCase()); // Lowercase the first letter
  };

  const onFieldUpdate = (value, index) => {
    jsonForm.fields[index].label = value.label;
    jsonForm.fields[index].fieldName = toCamelCase(value.label);
    jsonForm.fields[index].fieldTitle = value.label;
    jsonForm.fields[index].placeholder = value.placeholder;
    jsonForm.fields[index].options = value.options;
    jsonForm.fields[index].required = value.required;
    setUpdateTrigger(Date.now());
  };

  const addField = (field) => {
    jsonForm.fields.push({
      fieldName: field?.fieldName,
      fieldTitle: field?.fieldTitle,
      fieldType: field?.fieldType,
      label: field?.label,
      placeholder: field?.placeholder,
      options: field?.options,
    });
    setUpdateTrigger(Date.now());
  };

  const deleteField = (index) => {
    jsonForm.fields.splice(index, 1);
    setUpdateTrigger(Date.now());
  };

  const updateControllerFields = () => {
    setUpdateTrigger(Date.now());
  };

  const updateJsonFormInDb = async () => {
    try {
      setLoading(true);
      const result = await db
        .update(JsonForms)
        .set({
          jsonform: JSON.stringify(jsonForm),
          theme: selectedTheme,
          background: selectedBackground,
          style: JSON.stringify(selectedStyle),
          enabledSignIn: signInEnabled,
          isTemplate: isTemplate,
          isActive: isActive,
        })
        .where(
          and(
            eq(JsonForms.id, Number(params?.formId)),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      setLoading(false);
      toast.success("Form Updated Successfully");
    } catch (error) {
      setError(error);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <ProtectedPage>
      <section className="max-w-[1376px] mx-auto p-4 md:p-8 bg-background min-h-screen overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex flex-col gap-4 md:gap-6 w-full">
              <div className="flex flex-col gap-4 md:gap-6 md:flex-row md:items-center md:justify-between">
                <div
                  className="flex items-center gap-2 text-muted-foreground cursor-pointer hover:text-muted-foreground/200"
                  onClick={() => router.push("/my-forms")}
                >
                  <ArrowLeft />
                  <span className="text-sm font-medium break-words">Back</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/aiform/${record?.id}`} target="_blank">
                    <Button variant="outline" className="flex items-center ">
                      <SquareArrowOutUpRight className="h-5 w-5" />
                      Live Preview
                    </Button>
                  </Link>

                  <ShareButton
                    title="Share Form"
                    url={formUrl}
                    buttonText="Share Now"
                  />
                   <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        <Code className="h-5 w-5 mr-2" />
                        Embed
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Embed Form</DialogTitle>
                        <DialogDescription>
                          Copy this code to embed the form on your website.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="embed-code" className="text-sm font-medium">
                            Embed Code
                          </label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="embed-code"
                              value={embedCode}
                              readOnly
                              className="font-mono text-sm"
                            />
                            <Button onClick={copyEmbedCode} type="button">
                              Copy
                            </Button>
                          </div>
                        </div>
                        <div className="bg-muted p-4 rounded-md">
                          <h4 className="text-sm font-medium mb-2">Preview:</h4>
                          <div className="bg-card border rounded-md p-3">
                            <p className="text-xs text-muted-foreground">
                              Your form will appear like this on your website:
                            </p>
                            <div className="mt-2 border border-dashed p-2 flex items-center justify-center h-20">
                              <p className="text-sm text-center text-muted-foreground">
                                {record?.name || "Your Form"} will be embedded here
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="md:hidden p-6 bg-muted/40 flex flex-col items-center border rounded-xl text-center">
                <div className="max-w-sm">
                  <div className="p-4 bg-primary/20 rounded-md mb-4 inline-flex">
                    <Monitor className="text-primary w-9 h-9" />
                  </div>

                  <h2 className="text-foreground text-xl font-semibold">
                    To Edit this form Use Desktop
                  </h2>
                  <p className="text-muted-foreground">
                    Editing functionality is not available in Mobile
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Controller
                  selectedTheme={(value) => {
                    setSelectedTheme(value);
                    updateControllerFields();
                  }}
                  selectedBackground={(value) => {
                    setSelectedBackground(value);
                    updateControllerFields();
                  }}
                  selectedStyle={(value) => {
                    setSelectedStyle(value);
                    updateControllerFields();
                  }}
                  setSignInEnabled={(value) => {
                    setSignInEnabled(value);
                    updateControllerFields();
                  }}
                  addField={(field) => addField(field)}
                  isTemplate={isTemplate}
                  setIsTemplate={() => {
                    setIsTemplate((prev) => !prev);
                    updateControllerFields();
                  }}
                  isActive={isActive}
                  setIsActive={() => {
                    setIsActive((prev) => !prev);
                    updateControllerFields();
                  }}
                  signInEnabled={signInEnabled}
                />
                <div
                  className="md:col-span-2 rounded-2xl p-4 border"
                  style={{ background: selectedBackground }}
                >
                  {!isActive && (
                    <div className="p-3 text-center mb-4">
                      ⚠️ This form is currently deactivated. You cannot submit
                      responses.
                    </div>
                  )}
                  <FormUi
                    jsonForm={jsonForm}
                    selectedTheme={selectedTheme}
                    selectedStyle={selectedStyle}
                    onFieldUpdate={onFieldUpdate}
                    deleteField={(index) => deleteField(index)}
                    formId={record?.id}
                    setJsonForm={(val) => {
                      setJsonForm(val);
                      setUpdateTrigger(Date.now());
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </ProtectedPage>
  );
};

export default EditForm;
