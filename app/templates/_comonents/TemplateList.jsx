"use client";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import FormUi from "@/app/my-forms/edit-form/_components/FormUi";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import TemplateCard from "@/app/_components/TemplateCard";
import EmptyStatePlaceholder from "@/app/_components/EmptyStatePlaceholder";
import Loading from "@/app/_components/Loading";


const TemplateList = ({ columns, searchQuery, limit = 0 }) => {
  const [templateList, setTemplateList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewForm, setPreviewForm] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    getTemplatesList();
  }, []);

  const getTemplatesList = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(eq(JsonForms.isTemplate, true)) // Fetch only templates
        .orderBy(desc(JsonForms.id));

      setTemplateList(result);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Something went wrong while fetching templates.");
    }
    setLoading(false);
  };
  
  // Search logic
  const trimmedQuery = searchQuery?.trim().toLowerCase();
  const filteredTemplates = !trimmedQuery
    ? templateList
    : templateList.filter((template) => {
        const formTitle = JSON.parse(template.jsonform)?.formTitle || "";
        return formTitle.toLowerCase().includes(trimmedQuery);
      });
  
  // Apply limit if specified (limit > 0)
  const limitedTemplates = limit > 0 ? filteredTemplates.slice(0, limit) : filteredTemplates;
  
  const openPreview = (template) => {
    setPreviewForm(template);
    setIsPreviewOpen(true);
  };

  const handleUseTemplate = async (template) => {
    setLoading(true);
    try {
      const fullName =
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.firstName || "Unknown User";
      const result = await db
        .insert(JsonForms)
        .values({
          jsonform: template.jsonform,
          theme: template.theme,
          background: template.background,
          style: template.style,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD/MM/YYYY"),
          fullName: fullName,
        })
        .returning({ id: JsonForms.id });

      if (result[0]?.id) {
        toast.success("Template used successfully!");
        router.push("/my-forms");
      } else {
        toast.error("Failed to use the template. Please try again.");
      }
    } catch (error) {
      console.error("Error while using template:", error);
      toast.error("Something went wrong while using the template.");
    }
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-20">
          <Loading />
        </div>
      ) : limitedTemplates.length === 0 ? (
        <EmptyStatePlaceholder
          title="No templates found"
          description={
            searchQuery
              ? `No templates matching "${searchQuery}"`
              : "No templates available at the moment"
          }
        />
      ) : (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
          } gap-4 md:gap-6`}
        >
          {limitedTemplates.map((template, index) => (
            <TemplateCard
              template={template}
              key={index}
              index={index}
              handleUseTemplate={handleUseTemplate}
              openPreview={openPreview}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="w-full max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {previewForm?.formTitle || "Form Preview"}
            </DialogTitle>
          </DialogHeader>
          <div
            className="md:col-span-2 border rounded-lg p-5 flex items-center justify-center dark:border-gray-700"
            style={{ background: previewForm?.background }}
          >
            <FormUi
              jsonForm={
                previewForm?.jsonform ? JSON.parse(previewForm.jsonform) : null
              }
              selectedStyle={
                previewForm?.style ? JSON.parse(previewForm?.style) : null
              }
              selectedTheme={previewForm?.theme}
              editable={false}
              formId={previewForm?.id}
              enabledSignIn={previewForm?.enabledSignIn}
              isTemplateCard={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateList;