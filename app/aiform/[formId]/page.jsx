"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../config";
import { JsonForms } from "../../../config/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import FormUi from "../../my-forms/edit-form/_components/FormUi";
import { useParams } from "next/navigation";
import Loading from "@/app/_components/Loading";

const LiveAiForm = () => {
  const params = useParams();
  const [record, setRecord] = useState(null);
  const [jsonForm, setJsonForm] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params?.formId) {
      GetFormData(params.formId); // Pass formId explicitly
    }
  }, [params?.formId]);

  const GetFormData = async (formId) => {
    setLoading(true);

    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(eq(JsonForms.id, Number(formId)));
      setRecord(result[0]);
      setJsonForm(JSON.parse(result[0].jsonform));
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 mx-auto min-h-screen -mt-16">
      {loading ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col gap-6 items-center max-w-3xl w-full">
              {/* 🔹 Show Alert If Form is Not Active */}
              {record &&
                (!record?.isActive ? (
                  <div className="bg-red-500 text-white p-4 rounded-lg text-center">
                    ⚠️ This form is currently <strong>deactivated</strong>. You
                    cannot submit responses.
                  </div>
                ) : (
                  <div
                    className="p-4 rounded-2xl w-full"
                    style={{
                      background: record?.background,
                    }}
                  >
                    <FormUi
                      jsonForm={jsonForm}
                      selectedStyle={JSON.parse(record?.style)}
                      selectedTheme={record?.theme}
                      editable={false}
                      formId={record?.id}
                      enabledSignIn={record?.enabledSignIn}
                    />
                  </div>
                ))}

              <Link
                href={"/"}
                className="flex gap-2 items-center bg-muted/20 border p-2 rounded-badge "
              >
                <Image
                  src={"/logo-icon.svg"}
                  alt="logo"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div className="flex flex-col w-full">
                  <span className="text-lg font-bold">Formify</span>
                  <span className="text-sm text-muted-foreground">
                    Build your AI Form
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveAiForm;
