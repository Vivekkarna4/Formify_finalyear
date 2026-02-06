"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { db } from "../../config";
import { JsonForms } from "../../config/schema";
import { desc, eq } from "drizzle-orm";
import { Activity, FileText, Search, UsersRound } from "lucide-react";
import MyFormCard from "../_components/MyFormCard";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import ResponseStatItem from "./_components/ResponseStatItem";
import EmptyStatePlaceholder from "../_components/EmptyStatePlaceholder";
import { ProtectedPage } from "../_components/Protected";
import Image from "next/image";
import Loading from "../_components/Loading";

const ResponsesPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [formList, setFormList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalResponses, setTotalResponses] = useState(0);
  const [totalForms, setTotalForms] = useState(0);
  const [activeForms, setActiveForms] = useState(0);
  const [filteredForms, setFilteredForms] = useState([]);

  useEffect(() => {
    user && GetFormList();
    setTotalResponses(0);
  }, [user]);

  const GetFormList = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(JsonForms.id));
      setFormList(result);
      setTotalForms(result.length);
      const activeCount = result.filter((form) => form.isActive).length;
      setActiveForms(activeCount);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!searchQuery.trim()) {
      setFilteredForms(formList);
      return;
    }

    const filtered = formList.filter((form) => {
      const formTitle = JSON.parse(form.jsonform)?.formTitle || "";
      return formTitle.toLowerCase().includes(trimmedQuery);
    });

    setFilteredForms(filtered);
  }, [searchQuery, formList]);

  return (
    <ProtectedPage>
      <section className="max-w-[1376px] mx-auto p-4 md:p-8 flex flex-col gap-6 min-h-screen overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
          {/* Left Section: Heading & Description */}
          <div className="flex flex-col gap-1">
            <h2 className="font-bold text-2xl md:text-3xl">Responses</h2>
            <p className="text-muted-foreground text-base">
              View and manage your responses.
            </p>
          </div>

          {/* Right Section: Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground  h-5 w-5" />
            <Input
              className="pl-10 pr-4 w-full border rounded-md text-sm focus:ring-2 focus:ring-primary"
              placeholder='Search Forms e.g. "Cricket form"'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loading />
          </div>
        ) : formList.length === 0 ? (
          <EmptyStatePlaceholder
            title={"There is no responses yet."}
            description={" Share your form to get responses."}
          />
        ) : (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:gap-6 md:items-center">
              <ResponseStatItem
                label={"Total Forms"}
                value={totalForms}
                icon={FileText}
              />

              <ResponseStatItem
                label={"Total Responses"}
                value={totalResponses}
                icon={UsersRound}
              />

              <ResponseStatItem
                label={"Active Forms"}
                value={activeForms}
                icon={Activity}
              />
            </div>
            {filteredForms.length === 0 ? (
              <EmptyStatePlaceholder
                title={searchQuery ? "No matches found" : "No responses yet"}
                description={
                  searchQuery
                    ? `No forms matching "${searchQuery}"`
                    : "Share your forms to start collecting responses"
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredForms.map((form, index) => (
                  <MyFormCard
                    key={index}
                    formRecord={form}
                    jsonForm={JSON.parse(form.jsonform)}
                    setTotalResponses={(value) => setTotalResponses(value)}
                    options={false}
                    redirectTo={`/responses/form/${form.id}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </ProtectedPage>
  );
};

export default ResponsesPage;
